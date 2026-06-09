import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/Avatar';
import { Input } from '../components/Input';
import { Send, Bot, User, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIChatInterfaceProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<string> | string;
  botName?: string;
  botAvatar?: string;
}

export function AIChatInterface({
  initialMessages = [
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am your AI Assistant. How can I help you build today?",
      timestamp: new Date(),
    },
  ],
  onSendMessage,
  botName = 'Lerpa UI AI',
  botAvatar,
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue.trim();
    setInputValue('');

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      if (onSendMessage) {
        const responseText = await onSendMessage(userMessageText);
        const botMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Mock fallback response
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const botMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: `I've received your query: "${userMessageText}". As an AI Assistant built on Lerpa UI components, I can confirm this chat layout is fully responsive, accessible, and supports dark/light themes natively!`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (e) {
      if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Math.random().toString(),
        role: 'assistant',
        content: "Chat cleared! Ask me anything.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-3xl mx-auto overflow-hidden border border-border shadow-xl bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-primary/20 bg-primary/10 text-primary">
            {botAvatar ? (
              <AvatarImage src={botAvatar} alt={botName} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5 text-foreground">
              {botName}
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                Online
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Always active assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={clearChat} aria-label="Clear conversation" title="Clear conversation">
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-background/50">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isBot = message.role === 'assistant';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3 max-w-[85%]',
                  isBot ? 'self-start' : 'self-end flex-row-reverse ml-auto'
                )}
              >
                <Avatar className={cn('h-8 w-8 shrink-0', isBot ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground')}>
                  {isBot ? (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={cn(
                    'rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm',
                    isBot
                      ? 'bg-card border border-border text-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start">
            <Avatar className="h-8 w-8 shrink-0 bg-primary/10 text-primary">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border text-foreground rounded-lg p-3 text-sm flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-border bg-card p-4"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 focus-visible:ring-primary"
        />
        <Button type="submit" size="icon" aria-label="Send message" disabled={!inputValue.trim() || isTyping}>
          {isTyping ? (
            <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </form>
    </Card>
  );
}
