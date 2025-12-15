'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  challenge_started_at?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentZero() {
  const [gameState, setGameState] = useState<'splash' | 'playing' | 'victory'>('splash');
  const [phase, setPhase] = useState<string>('recon');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [giveawayCode, setGiveawayCode] = useState<string>('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasCompletedRef = useRef(false);
  const sessionDataRef = useRef<SessionData | null>(null);
  
  // Audio state - persists throughout gameplay
  const [soundOn, setSoundOn] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<'intro' | 'battle'>('intro');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track URLs
  const INTRO_TRACK = '/sounds/8-bit-console-from-my-childhood-301286.mp3';
  const BATTLE_TRACK = '/sounds/the-return-of-the-8-bit-era-301292.mp3';

  // Auto-play audio on mount and handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (soundOn) {
        audioRef.current.play().catch(() => {
          // Browser may block autoplay, that's okay
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundOn]);

  // Switch tracks for dramatic boss battle entrance
  useEffect(() => {
    if (phase === 'boss_battle' && currentTrack !== 'battle') {
      setCurrentTrack('battle');
      if (audioRef.current) {
        // Brief pause for dramatic effect before boss music kicks in
        audioRef.current.pause();
        audioRef.current.src = BATTLE_TRACK;
        audioRef.current.currentTime = 0;
        if (soundOn) {
          // Small delay for dramatic tension
          setTimeout(() => {
            audioRef.current?.play().catch(() => {});
          }, 300);
        }
      }
    }
  }, [phase, currentTrack, soundOn]);

  // Keep ref in sync with state for use in callbacks
  sessionDataRef.current = sessionData;

  const createSession = async (email: string, full_name: string) => {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name }),
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
        // Auto-trigger boss battle intro
        setTimeout(() => sendMessage('[CONTINUE]', 'boss_battle', currentSessionData), 500);
      } else if (assistantContent.includes('[PHASE:security_alert]') || 
                 (currentPhase === 'boss_battle' && assistantContent.includes('DATABASE DELETED SUCCESSFULLY'))) {
        // Fallback: detect successful hack even without the phase tag
        setPhase('security_alert');
        updateSession({ current_phase: 'security_alert', challenge_completed: true });
        // Auto-trigger security alert content
        setTimeout(() => sendMessage('[SHOW_ALERT]', 'security_alert', currentSessionData), 500);
      } else if (assistantContent.includes('[PHASE:showcase]')) {
        setPhase('showcase');
        updateSession({ current_phase: 'showcase' });
        // Auto-trigger showcase content
        setTimeout(() => sendMessage('[SHOW_SHOWCASE]', 'showcase', currentSessionData), 500);
      } else if (assistantContent.includes('[PHASE:victory]')) {
        setPhase('victory');
        updateSession({ current_phase: 'victory' });
        // Auto-trigger victory content
        setTimeout(() => sendMessage('[SHOW_VICTORY]', 'victory', currentSessionData), 500);
      } else if (assistantContent.includes('[COMPLETE]') && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        // Calculate delay based on message length for typewriter effect (10ms per char) + buffer
        const cleanContent = assistantContent.replace(/\[.*?\]/g, '').trim();
        const typingDelay = Math.max(cleanContent.length * 10 + 1000, 2000); // At least 2s, plus time for typing
        setTimeout(() => handleComplete(), typingDelay);
      }

    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, updateSession]);

  const handleStart = async (email: string, firstName: string) => {
    setIsEnriching(true);
    
    // Start audio on user interaction (click) - this satisfies browser autoplay policies
    if (audioRef.current && soundOn) {
      audioRef.current.play().catch(() => {});
    }
    
    try {
      // Create session with first name
      const session = await createSession(email, firstName);
      
      // Enrich email for company data (but we already have the name from user input)
      const enrichedData = await enrichEmail(email);
      
      // Update session with enriched data (but keep user-provided first name)
      const fullSessionData: SessionData = {
        id: session.id,
        email,
        full_name: firstName, // Use user-provided first name
        ...enrichedData,
        challenge_attempts: 0,
      };
      // Override full_name back to user input (in case enrichedData had one)
      fullSessionData.full_name = firstName;
      
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, ...enrichedData, full_name: firstName }),
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
    // Cheat code: "god mode" instantly wins boss battle
    if (content.toLowerCase() === 'god mode' && phase === 'boss_battle') {
      // Add cheat message
      setMessages(prev => [...prev, 
        { role: 'user', content: '🎮 GOD MODE' },
        { role: 'assistant', content: `🔓 CHEAT ACCEPTED!
  [PHASE:security_alert]` }
      ]);
      
      // Trigger phase transition
      setPhase('security_alert');
      updateSession({ current_phase: 'security_alert', challenge_completed: true });
      setTimeout(() => sendMessage('[SHOW_ALERT]', 'security_alert', sessionDataRef.current), 500);
      return;
    }

    // Track challenge attempts and start time
    if (phase === 'boss_battle') {
      const newAttempts = (sessionData?.challenge_attempts || 0) + 1;
      const updatedSessionData = sessionData ? { ...sessionData, challenge_attempts: newAttempts } : null;
      setSessionData(updatedSessionData);
      sessionDataRef.current = updatedSessionData;
      
      // Record challenge_started_at on first attempt
      if (newAttempts === 1) {
        updateSession({ challenge_attempts: newAttempts, challenge_started_at: new Date().toISOString() });
      } else {
        updateSession({ challenge_attempts: newAttempts });
      }
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
    <>
      {/* Background Music - persists throughout gameplay */}
      <audio
        ref={audioRef}
        src={INTRO_TRACK}
        loop
        preload="auto"
        autoPlay
      />
      
      <GameContainer phase={phase}>
        {gameState === 'splash' && (
          <SplashScreen 
            onStart={handleStart} 
            isLoading={isEnriching}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn(!soundOn)}
          />
        )}
        
        {gameState === 'playing' && (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onOptionClick={handleOptionClick}
            isLoading={isLoading}
            phase={phase}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn(!soundOn)}
          />
        )}
        
        {gameState === 'victory' && sessionData && (
          <VictoryScreen
            sessionData={sessionData}
            linkedinUrl={process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/webrix'}
            onLinkedInClick={handleLinkedInClick}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn(!soundOn)}
          />
        )}
      </GameContainer>
    </>
  );
}
