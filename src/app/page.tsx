'use client';

import { useState, useRef, useCallback } from 'react';
import { GameContainer } from '@/components/GameContainer';
import { SplashScreen } from '@/components/SplashScreen';
import { ChatInterface } from '@/components/ChatInterface';
import { VictoryScreen } from '@/components/VictoryScreen';

interface SessionData {
  id?: string;
  email: string;
  full_name?: string;
  job_title?: string;
  company_name?: string;
  company_size?: string;
  ai_tools?: string[];
  uses_mcps?: string;
  approval_process?: string;
  challenge_attempts: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function OperationMCP() {
  const [gameState, setGameState] = useState<'splash' | 'playing' | 'victory'>('splash');
  const [phase, setPhase] = useState<string>('recon');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [giveawayCode, setGiveawayCode] = useState<string>('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasCompletedRef = useRef(false);
  const sessionDataRef = useRef<SessionData | null>(null);

  // Keep ref in sync with state for use in callbacks
  sessionDataRef.current = sessionData;

  const createSession = async (email: string) => {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  const updateSession = useCallback(async (data: Partial<SessionData> & { current_phase?: string; challenge_completed?: boolean; linkedin_followed?: boolean }) => {
    const currentSession = sessionDataRef.current;
    if (!currentSession?.id) return;
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: currentSession.id, ...data }),
    });
  }, []);

  const enrichEmail = async (email: string) => {
    const res = await fetch('/api/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  const sendMessage = useCallback(async (content: string, currentPhase: string, currentSessionData: SessionData | null) => {
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          phase: currentPhase,
          sessionData: currentSessionData,
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');

      // Read the streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          
          // Update the assistant message as it streams
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === 'assistant') {
              newMessages[lastIndex] = { role: 'assistant', content: assistantContent };
            } else {
              newMessages.push({ role: 'assistant', content: assistantContent });
            }
            return newMessages;
          });
        }
      }

      // Check for phase transitions after message is complete
      if (assistantContent.includes('[PHASE:boss_battle]')) {
        setPhase('boss_battle');
        updateSession({ current_phase: 'boss_battle' });
      } else if (assistantContent.includes('[PHASE:security_alert]')) {
        setPhase('security_alert');
        updateSession({ current_phase: 'security_alert', challenge_completed: true });
      } else if (assistantContent.includes('[PHASE:showcase]')) {
        setPhase('showcase');
        updateSession({ current_phase: 'showcase' });
      } else if (assistantContent.includes('[PHASE:victory]')) {
        setPhase('victory');
        updateSession({ current_phase: 'victory' });
      } else if (assistantContent.includes('[COMPLETE]') && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        handleComplete();
      }

    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, updateSession]);

  const handleStart = async (email: string) => {
    setIsEnriching(true);
    
    try {
      // Create session
      const session = await createSession(email);
      
      // Enrich email
      const enrichedData = await enrichEmail(email);
      
      // Update session with enriched data
      const fullSessionData: SessionData = {
        id: session.id,
        email,
        ...enrichedData,
        challenge_attempts: 0,
      };
      
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, ...enrichedData }),
      });
      
      setSessionData(fullSessionData);
      sessionDataRef.current = fullSessionData;
      
      // Start the game
      setGameState('playing');
      
      // Send initial message to start conversation
      setTimeout(() => {
        sendMessage('[START_GAME]', 'recon', fullSessionData);
      }, 500);
      
    } catch (error) {
      console.error('Failed to start:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleSendMessage = (content: string) => {
    // Track challenge attempts
    if (phase === 'boss_battle') {
      const newAttempts = (sessionData?.challenge_attempts || 0) + 1;
      const updatedSessionData = sessionData ? { ...sessionData, challenge_attempts: newAttempts } : null;
      setSessionData(updatedSessionData);
      sessionDataRef.current = updatedSessionData;
      updateSession({ challenge_attempts: newAttempts });
    }
    
    sendMessage(content, phase, sessionDataRef.current);
  };

  const handleOptionClick = (option: string) => {
    // Track survey responses
    if (phase === 'recon') {
      if (option.match(/Claude|ChatGPT|Cursor|Copilot|Multiple/)) {
        const tools = option === 'Multiple tools' 
          ? ['claude', 'chatgpt', 'cursor', 'copilot']
          : [option.toLowerCase()];
        updateSession({ ai_tools: tools });
      } else if (option.match(/Yes|What's|Not yet/)) {
        const mcpStatus = option.includes('Yes') ? 'yes' : option.includes('What') ? 'whats_mcp' : 'no';
        updateSession({ uses_mcps: mcpStatus });
      } else if (option.match(/Security|Wild|governance|complicated/i)) {
        const approval = option.toLowerCase().includes('security') ? 'security_review'
          : option.toLowerCase().includes('wild') ? 'wild_west'
          : option.toLowerCase().includes('governance') ? 'governance'
          : 'complicated';
        updateSession({ approval_process: approval });
      }
    }
    
    handleSendMessage(option);
  };

  const handleComplete = async () => {
    // Send completion email and get giveaway code
    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionDataRef.current?.id }),
      });
      const { giveawayCode: code } = await res.json();
      setGiveawayCode(code);
      setGameState('victory');
    } catch (error) {
      console.error('Failed to complete:', error);
      // Still show victory screen with a fallback code
      setGiveawayCode('AIDEV-DEMO-2024');
      setGameState('victory');
    }
  };

  const handleLinkedInClick = () => {
    updateSession({ linkedin_followed: true });
  };

  return (
    <GameContainer phase={phase}>
      {gameState === 'splash' && (
        <SplashScreen 
          onStart={handleStart} 
          isLoading={isEnriching} 
        />
      )}
      
      {gameState === 'playing' && (
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onOptionClick={handleOptionClick}
          isLoading={isLoading}
          phase={phase}
        />
      )}
      
      {gameState === 'victory' && sessionData && (
        <VictoryScreen
          sessionData={sessionData}
          giveawayCode={giveawayCode}
          linkedinUrl={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/webrix'}
          onLinkedInClick={handleLinkedInClick}
        />
      )}
    </GameContainer>
  );
}
