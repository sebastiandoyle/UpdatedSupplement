'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, Sparkles, ArrowRight, RotateCcw, Info } from 'lucide-react';

const GAME_DURATION = 30;

const symptoms = [
  { id: 1, text: "I need an immediate energy boost", interventions: ["Caffeine", "10 Pushups"] },
  { id: 2, text: "I feel anxious and jittery", interventions: ["L-Theanine", "Meditation", "Ashwagandha"] },
  { id: 3, text: "I'm feeling mentally foggy", interventions: ["Caffeine", "L-Theanine"] },
  { id: 4, text: "I need to feel more grounded", interventions: ["Meditation", "Ashwagandha"] },
  { id: 5, text: "I want natural hormone support", interventions: ["Tongkat Ali", "Maca"] },
  { id: 6, text: "I feel physically sluggish", interventions: ["10 Pushups", "Maca"] },
  { id: 7, text: "I need stress relief", interventions: ["L-Theanine", "Meditation"] },
  { id: 8, text: "I want better workout energy", interventions: ["Caffeine", "Tongkat Ali"] },
  { id: 9, text: "I need to calm down", interventions: ["Meditation", "L-Theanine"] },
  { id: 10, text: "I want better mental focus", interventions: ["Caffeine", "L-Theanine"] },
  { id: 11, text: "I need a mood lift", interventions: ["Maca", "10 Pushups"] },
  { id: 12, text: "I feel tense and wound up", interventions: ["Meditation", "Ashwagandha"] },
  { id: 13, text: "I want sustainable energy", interventions: ["Maca", "Tongkat Ali"] },
  { id: 14, text: "I need physical motivation", interventions: ["10 Pushups", "Caffeine"] },
  { id: 15, text: "I want better stress resilience", interventions: ["Ashwagandha", "Meditation"] },
  { id: 16, text: "I need mental clarity", interventions: ["L-Theanine", "Caffeine"] },
  { id: 17, text: "I want natural vitality", interventions: ["Tongkat Ali", "Maca"] },
  { id: 18, text: "I need quick stress relief", interventions: ["10 Pushups", "Meditation"] },
  { id: 19, text: "I want balanced energy", interventions: ["L-Theanine", "Maca"] },
  { id: 20, text: "I need to reset my mind", interventions: ["Meditation", "L-Theanine"] }
];

const interventions = [
  { 
    name: "Caffeine",
    benefits: ["Quick energy boost", "Mental alertness", "Focus enhancement"],
    timing: "15-45 mins",
    dosage: "80-200mg",
    score: 0,
    image: "☕️"
  },
  { 
    name: "L-Theanine",
    benefits: ["Calm focus", "Reduced anxiety", "Better with caffeine"],
    timing: "30-60 mins",
    dosage: "100-200mg",
    score: 0,
    image: "🍵"
  },
  { 
    name: "Ashwagandha",
    benefits: ["Stress reduction", "Anxiety relief", "Better sleep"],
    timing: "2-3 hours",
    dosage: "300-600mg",
    score: 0,
    image: "🌿"
  },
  { 
    name: "Maca",
    benefits: ["Natural energy", "Hormone balance", "Vitality"],
    timing: "1-2 hours",
    dosage: "1500-3000mg",
    score: 0,
    image: "🌱"
  },
  { 
    name: "Tongkat Ali",
    benefits: ["Testosterone support", "Physical energy", "Performance"],
    timing: "1-3 hours",
    dosage: "200-400mg",
    score: 0,
    image: "🌳"
  },
  { 
    name: "Meditation",
    benefits: ["Stress relief", "Mental clarity", "Emotional balance"],
    timing: "Immediate",
    dosage: "5-15 mins",
    score: 0,
    image: "🧘"
  },
  { 
    name: "10 Pushups",
    benefits: ["Quick energy", "Blood flow", "Mental reset"],
    timing: "Immediate",
    dosage: "10 reps",
    score: 0,
    image: "💪"
  }
];

export default function WellnessQuiz() {
  const [gameState, setGameState] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentPair, setCurrentPair] = useState([]);
  const [rankings, setRankings] = useState([...interventions]);
  const [selected, setSelected] = useState([]);
  const [lastPicked, setLastPicked] = useState(null);
  const timerRef = useRef(null);

  const getNewPair = () => {
    const available = symptoms.filter(s => !selected.includes(s.id));
    if (available.length < 2) {
      endGame();
      return null;
    }
    return available.sort(() => Math.random() - 0.5).slice(0, 2);
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setSelected([]);
    setRankings(interventions.map(s => ({ ...s, score: 0 })));
    setCurrentPair(getNewPair());
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState('results');
  };

  const handleChoice = (symptom) => {
    setLastPicked(symptom);
    setSelected(prev => [...prev, symptom.id]);

    // Update scores and sort rankings
    const newRankings = rankings.map(int => ({
      ...int,
      score: int.score + (symptom.interventions.includes(int.name) ? 1 : 0)
    })).sort((a, b) => b.score - a.score);

    setRankings(newRankings);
    const nextPair = getNewPair();
    if (nextPair) setCurrentPair(nextPair);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const renderChoice = (symptom, index) => (
    <button
      onClick={() => handleChoice(symptom)}
      className={`
        p-6 rounded-xl text-white text-center
        transition-all duration-300 transform hover:scale-105 relative
        flex flex-col items-center justify-center min-h-[200px]
        ${index === 0 
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
          : 'bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'}
      `}
    >
      <div className="max-w-[280px] mx-auto">
        <div className="text-sm md:text-base opacity-75 mb-2">Right now...</div>
        <div className="text-lg md:text-xl font-bold leading-tight">
          {symptom.text}
        </div>
      </div>
    </button>
  );

  const renderRanking = (intervention, index) => (
    <div
      key={intervention.name}
      className={`
        p-4 rounded-xl transition-all duration-300
        ${index === 0 ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30' : 'bg-white/10'}
      `}
      style={{
        transform: `translateY(${index * 4}px)`,
        transition: 'transform 0.5s ease-out'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-slate-300 w-8">
          #{index + 1}
        </div>
        <span className="text-2xl">{intervention.image}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold truncate">{intervention.name}</h4>
          <p className="text-sm text-slate-300 truncate">
            {intervention.dosage} • {intervention.timing}
          </p>
        </div>
        {lastPicked?.interventions.includes(intervention.name) && (
          <Badge className="bg-green-500 animate-bounce">+1</Badge>
        )}
      </div>
    </div>
  );

  if (gameState === 'intro') {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6 text-center space-y-6">
          <h1 className="text-3xl font-bold">Energy & Wellness Quiz</h1>
          <p className="text-lg opacity-75">Find your perfect mix of supplements and activities</p>
          <div className="bg-black/20 rounded-lg p-4 text-left">
            <h3 className="font-bold mb-2">Includes recommendations for:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {interventions.map(int => (
                <div key={int.name} className="flex items-center gap-2">
                  <span>{int.image}</span>
                  <span>{int.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Start Quiz
            <Sparkles className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="flex justify-between items-center">
          <div className="bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="text-slate-300">
            {selected.length} of {symptoms.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPair.map((symptom, index) => renderChoice(symptom, index))}
        </div>

        <div className="bg-black/20 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Top Recommendations</h3>
          <div className="space-y-3">
            {rankings.map((int, index) => renderRanking(int, index))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold">Your Personalized Plan</h2>
          <p className="text-sm text-slate-300 mt-2">Mix and match these for optimal results</p>
        </div>

        <div className="space-y-4">
          {rankings.slice(0, 4).map((int, index) => (
            <div
              key={int.name}
              className={`
                p-4 rounded-xl
                ${index === 0 ? 'bg-yellow-500/20' : 'bg-white/10'}
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{int.image}</span>
                <div>
                  <h3 className="font-bold">{int.name}</h3>
                  <p className="text-sm text-slate-300">
                    {int.dosage} • {int.timing}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-300">
                {int.benefits.join(' • ')}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={startGame}>
            <RotateCcw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Info className="mr-2 w-4 h-4" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}