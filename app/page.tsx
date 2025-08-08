"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Moon, Zap, Trophy, RotateCcw, Play, AlertTriangle, Sparkles, Star } from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  type: 'button' | 'click' | 'drag' | 'wait' | 'type' | 'multiple'
  completed: boolean
}

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "DO NOT Drag This Toast Into the Bathtub",
    description: "⚠️ DO NOT DRAG THE TOAST INTO THE BATHTUB",
    type: 'drag',
    completed: false
  },
  {
    id: 2,
    title: "Count the Invisible Sheep",
    description: "Count how many invisible sheep are here. Click the correct number.",
    type: 'multiple',
    completed: false
  },
  {
    id: 3,
    title: "Stare at This Dot for 10 Seconds",
    description: "Stare at this dot for 10 seconds. Do not blink. Do not think.",
    type: 'wait',
    completed: false
  },
  {
    id: 4,
    title: "Name This Object",
    description: "What is this mysterious object?",
    type: 'multiple',
    completed: false
  },
  {
    id: 5,
    title: "Repeat After Me: I Am Smart",
    description: "Click the button to repeat the affirmation",
    type: 'click',
    completed: false
  }
]

const BADGES = [
  "Certified Toast Technician",
  "Sheep Whisperer (Invisible Edition)",
  "Dot Starer Pro Max",
  "Creative Denier",
  "Affirmation Overlord"
]

const SHEEP_OPTIONS = ["0", "5", "42", "Banana"]
const OBJECT_OPTIONS = ["Supercomputer", "Brain Booster 3000", "It's a sock, bro", "CEO of Intelligence"]
const AFFIRMATIONS = [
  "I am smart.",
  "I am totally smart.",
  "I'm the smartest potato alive.",
  "My brain is 99% water and 1% luck.",
  "I forgot why I'm clicking this."
]

const TASK_MESSAGES = [
  "Nice job, Einstein. Toast and tubs are a great combo. IQ -10.",
  "Correct! You clearly operate on a different level. IQ -10.",
  "You just wasted 10 seconds and several brain cells. Congratulations.",
  "Correct! You ignored reality. That's the spirit.",
  "Repetition is the first sign of smooth brain."
]

export default function IQDecreaser() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [iqScore, setIqScore] = useState(100)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [clickCount, setClickCount] = useState(0)
  const [waitTimer, setWaitTimer] = useState(10)
  const [typedText, setTypedText] = useState("")
  const [showCheater, setShowCheater] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [brainAnimation, setBrainAnimation] = useState("")
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [repeatCount, setRepeatCount] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState("I am smart.")
  const [showExplosion, setShowExplosion] = useState(false)

  const currentTask = tasks[currentTaskIndex]

  useEffect(() => {
    if (currentTask?.type === 'wait' && !currentTask.completed) {
      const timer = setInterval(() => {
        setWaitTimer((prev) => {
          if (prev <= 1) {
            completeTask()
            return 10
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentTaskIndex, currentTask])

  const startGame = () => {
    setGameStarted(true)
    setBrainAnimation("animate-spin")
    setTimeout(() => setBrainAnimation(""), 2000)
  }

  const completeTask = () => {
    const updatedTasks = [...tasks]
    updatedTasks[currentTaskIndex].completed = true
    setTasks(updatedTasks)
    
    setIqScore(prev => Math.max(0, prev - 10))
    setEarnedBadges(prev => [...prev, BADGES[currentTaskIndex]])
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1)
        resetTaskState()
      }
    }, 3000)
  }

  const skipTask = () => {
    setShowCheater(true)
    setTimeout(() => {
      setShowCheater(false)
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1)
        resetTaskState()
      }
    }, 2000)
  }

  const resetTaskState = () => {
    setClickCount(0)
    setWaitTimer(10)
    setTypedText("")
    setSelectedAnswer("")
    setRepeatCount(0)
    setCurrentAffirmation("I am smart.")
    setShowExplosion(false)
  }

  const restartGame = () => {
    setGameStarted(false)
    setCurrentTaskIndex(0)
    setTasks(INITIAL_TASKS)
    setIqScore(100)
    setEarnedBadges([])
    resetTaskState()
    setShowCheater(false)
    setShowSuccess(false)
  }

  const handleTaskClick = () => {
    if (currentTask?.type === 'click') {
      const newCount = clickCount + 1
      setClickCount(newCount)
      if (newCount >= 100) {
        completeTask()
      }
    }
  }

  const handleForbiddenButton = () => {
    setBrainAnimation("animate-pulse")
    setTimeout(() => setBrainAnimation(""), 1000)
    completeTask()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "moon")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")
    if (data === "moon") {
      completeTask()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setTypedText(value)
    if (value === "TRAMS") {
      completeTask()
    }
  }

  const handleToastDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")
    if (data === "toast") {
      setShowExplosion(true)
      setTimeout(() => {
        setShowExplosion(false)
        completeTask()
      }, 2000)
    }
  }

  const handleMultipleChoice = (answer: string) => {
    setSelectedAnswer(answer)
    const isCorrect = (currentTaskIndex === 1 && answer === "Banana") || 
                     (currentTaskIndex === 3 && answer !== "It's a sock, bro")
    if (isCorrect) {
      setTimeout(() => completeTask(), 1000)
    }
  }

  const handleAffirmationClick = () => {
    const newCount = repeatCount + 1
    setRepeatCount(newCount)
    if (newCount < AFFIRMATIONS.length) {
      setCurrentAffirmation(AFFIRMATIONS[newCount])
    }
    if (newCount >= 5) {
      completeTask()
    }
  }

  const handleToastDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "toast")
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Floating cartoon elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse">🎈</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-spin">🎪</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce">🎭</div>
        
        <div className="text-center space-y-8 max-w-2xl relative z-10">
          <div className="space-y-6">
            <div className="relative">
              <Brain className={`w-32 h-32 mx-auto text-yellow-300 ${brainAnimation} drop-shadow-2xl`} />
              <div className="absolute -top-4 -right-4 text-3xl animate-spin">⭐</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce">💫</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-8 border-white/30 shadow-2xl transform rotate-1">
              <h1 className="text-7xl font-black text-white drop-shadow-lg transform -rotate-1 mb-4" 
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                IQ Decreaser
              </h1>
              <div className="bg-yellow-300 text-purple-800 px-6 py-3 rounded-full border-4 border-purple-600 transform rotate-2 inline-block">
                <p className="text-2xl font-black" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  A brain-training app… but for becoming dumber! 🧠💥
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Button
              onClick={startGame}
              className="text-3xl px-16 py-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black rounded-full transform hover:scale-110 transition-all duration-300 shadow-2xl animate-bounce border-8 border-white/50"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              <Play className="w-10 h-10 mr-4" />
              Start Getting Dumber! 🚀
            </Button>
            <div className="absolute -top-6 -right-6 text-4xl animate-spin">🎯</div>
            <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce">💥</div>
          </div>
          
          <div className="bg-cyan-300 text-purple-800 px-8 py-4 rounded-2xl border-4 border-purple-600 transform -rotate-1 shadow-xl">
            <p className="text-xl font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Perfect for teenagers, students, or anyone bored enough to become intentionally dumb for laughs! 😂🎉
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
        <div className="absolute top-20 right-20 text-3xl animate-spin">🎊</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">🌟</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce">✨</div>
        <div className="absolute top-1/2 left-10 text-3xl animate-ping">💫</div>
        <div className="absolute top-1/3 right-10 text-4xl animate-spin">🎈</div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="relative">
            <Sparkles className="w-40 h-40 mx-auto text-yellow-300 animate-spin drop-shadow-2xl" />
            <div className="absolute -top-8 -right-8 text-5xl animate-bounce">🏆</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse">⭐</div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-8 border-yellow-300 shadow-2xl transform -rotate-1">
              <h2 className="text-6xl font-black text-yellow-300 animate-bounce drop-shadow-lg mb-4"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                CONGRATULATIONS! 🎊
              </h2>
              <div className="bg-pink-300 text-purple-800 px-6 py-4 rounded-2xl border-4 border-purple-600 transform rotate-1">
                <p className="text-2xl font-bold animate-pulse max-w-2xl"
                   style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {TASK_MESSAGES[currentTaskIndex]} 🤪
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-3xl p-6 border-8 border-white/50 shadow-2xl transform rotate-2">
            <Trophy className="w-20 h-20 mx-auto text-purple-600 animate-bounce mb-4" />
            <div className="bg-white/80 rounded-2xl p-4 border-4 border-purple-600">
              <p className="text-purple-800 font-black text-xl"
                 style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                🏅 {earnedBadges[earnedBadges.length - 1]} 🏅
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showCheater) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-pulse">
        {/* Warning elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">⚠️</div>
        <div className="absolute top-20 right-20 text-3xl animate-spin">🚨</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">❌</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce">💀</div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="relative">
            <AlertTriangle className="w-40 h-40 mx-auto text-red-700 animate-bounce drop-shadow-2xl" />
            <div className="absolute -top-6 -right-6 text-5xl animate-spin">🚨</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse">💥</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-8 border-red-700 shadow-2xl transform -rotate-2">
            <h2 className="text-7xl font-black text-red-700 animate-pulse drop-shadow-lg mb-4"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              YOU ARE A CHEATER! 😤
            </h2>
            <div className="bg-yellow-300 text-red-700 px-6 py-4 rounded-2xl border-4 border-red-700 transform rotate-1">
              <p className="text-3xl font-bold"
                 style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                Skipping tasks won't make you dumber faster! 🙄💭
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentTaskIndex >= tasks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Victory elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🎊</div>
        <div className="absolute top-20 right-20 text-3xl animate-spin">🏆</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-pulse">🎉</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce">⭐</div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="relative">
            <Brain className="w-40 h-40 mx-auto text-yellow-300 animate-pulse drop-shadow-2xl" />
            <div className="absolute -top-8 -right-8 text-5xl animate-spin">👑</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce">🎯</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-8 border-yellow-300 shadow-2xl transform rotate-1">
            <h2 className="text-6xl font-black text-yellow-300 mb-6 drop-shadow-lg"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              MISSION ACCOMPLISHED! 🚀
            </h2>
            <div className="bg-green-300 text-purple-800 px-6 py-4 rounded-2xl border-4 border-purple-600 transform -rotate-1">
              <p className="text-3xl font-bold"
                 style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                You are now officially dumber! 🧠💥
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-300 to-blue-300 rounded-3xl p-6 border-8 border-white/50 shadow-2xl transform -rotate-1">
            <p className="text-3xl font-black text-purple-800 mb-4"
               style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Final IQ Score: {iqScore} 🎯
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {earnedBadges.map((badge, index) => (
                <div key={index} className="bg-yellow-300 text-purple-800 px-4 py-2 rounded-full border-4 border-purple-600 font-black transform rotate-1 animate-pulse">
                  🏅 {badge}
                </div>
              ))}
            </div>
          </div>
          
          <Button
            onClick={restartGame}
            className="text-2xl px-12 py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black rounded-full border-8 border-white/50 shadow-2xl transform hover:scale-110 transition-all duration-300"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            <RotateCcw className="w-8 h-8 mr-3" />
            Restart IQ Journey! 🔄
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 p-4 relative overflow-hidden"
      onClick={handleTaskClick}
    >
      {/* Floating cartoon elements */}
      <div className="absolute top-5 left-5 text-3xl animate-bounce">🎈</div>
      <div className="absolute top-10 right-10 text-2xl animate-spin">⭐</div>
      <div className="absolute bottom-5 left-5 text-4xl animate-pulse">🎪</div>
      <div className="absolute bottom-10 right-5 text-3xl animate-bounce">🎭</div>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-8 border-white/30 shadow-2xl transform -rotate-1 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl font-black text-purple-700 drop-shadow-lg transform rotate-1"
                style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              🧠 IQ Decreaser 💥
            </h1>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl px-6 py-3 border-4 border-purple-600 shadow-xl transform rotate-2">
                <span className="font-black text-purple-800 text-xl"
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  🎯 IQ: {iqScore}
                </span>
              </div>
              <div className="bg-white/80 rounded-2xl p-2 border-4 border-purple-600">
                <Progress value={iqScore} className="w-32 h-4" />
              </div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            {earnedBadges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-300 to-orange-300 text-purple-800 px-4 py-2 rounded-full border-4 border-purple-600 font-black animate-pulse shadow-xl transform rotate-1">
                <Trophy className="w-5 h-5 mr-2 inline" />
                🏅 {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Task Area */}
      <div className="max-w-2xl mx-auto relative z-10">
        <Card className="bg-white/90 shadow-2xl border-8 border-purple-600 rounded-3xl transform rotate-1">
          <CardContent className="p-8 text-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-cyan-300 to-blue-300 rounded-2xl p-6 border-4 border-purple-600 transform -rotate-1">
                <h2 className="text-4xl font-black text-purple-800 mb-3 drop-shadow-lg"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  🎯 Task {currentTaskIndex + 1} of {tasks.length} 🎯
                </h2>
                <div className="bg-white/80 rounded-xl p-4 border-4 border-purple-600 transform rotate-1">
                  <h3 className="text-2xl font-bold text-purple-800 mb-3"
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    {currentTask?.title}
                  </h3>
                  <p className="text-xl text-purple-700 font-bold"
                     style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    {currentTask?.description}
                  </p>
                </div>
              </div>

              {/* Task-specific content */}
              <div className="space-y-6">
                {/* Task 1: Toast and Bathtub */}
                {currentTask?.type === 'drag' && currentTaskIndex === 0 && (
                  <div className="space-y-6">
                    {showExplosion && (
                      <div className="text-9xl animate-ping">💥⚡💥</div>
                    )}
                    <div className="bg-red-300 rounded-2xl p-4 border-4 border-red-600 transform -rotate-1 animate-pulse">
                      <div className="text-3xl font-black text-red-700 animate-bounce"
                           style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        ⚠️ DO NOT DRAG THE TOAST INTO THE BATHTUB ⚠️
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center bg-yellow-200 rounded-2xl p-4 border-4 border-yellow-600 transform rotate-2">
                        <div 
                          className="text-8xl cursor-move animate-bounce hover:animate-spin"
                          draggable
                          onDragStart={handleToastDragStart}
                        >
                          🍞
                        </div>
                        <p className="text-lg font-black text-yellow-800 mt-2"
                           style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          Toast (Drag me!) 🎯
                        </p>
                      </div>
                      <div className="text-6xl animate-pulse">→</div>
                      <div
                        className="text-center bg-blue-200 rounded-2xl p-4 border-4 border-blue-600 transform -rotate-2"
                        onDrop={handleToastDrop}
                        onDragOver={handleDragOver}
                      >
                        <div className="text-8xl hover:animate-bounce">🛁</div>
                        <p className="text-lg font-black text-blue-800 mt-2"
                           style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          Bathtub (Drop here!) ⚡
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Task 2: Invisible Sheep */}
                {currentTask?.type === 'multiple' && currentTaskIndex === 1 && (
                  <div className="space-y-6">
                    <div className="bg-green-200 p-8 rounded-2xl border-4 border-green-600 transform rotate-1">
                      <p className="text-xl font-bold text-green-800 mb-4"
                         style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        Look carefully at this empty field... 👀
                      </p>
                      <div className="h-32 bg-gradient-to-b from-green-300 to-green-400 rounded-xl border-4 border-green-600 flex items-center justify-center">
                        <span className="text-green-700 text-2xl font-bold animate-pulse"
                              style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          🌾 Empty Field (or is it?) 🌾
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {SHEEP_OPTIONS.map((option) => (
                        <Button
                          key={option}
                          onClick={() => handleMultipleChoice(option)}
                          className={`text-2xl py-6 font-black rounded-2xl border-4 transform hover:scale-105 transition-all duration-300 ${
                            selectedAnswer === option 
                              ? 'bg-yellow-400 text-purple-800 border-purple-600 animate-bounce' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-white/50'
                          }`}
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          {option} 🐑
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task 3: Dot Staring */}
                {currentTask?.type === 'wait' && currentTaskIndex === 2 && (
                  <div className="space-y-6">
                    <div className="bg-black p-16 rounded-2xl border-8 border-purple-600 transform -rotate-1">
                      <div className="w-6 h-6 bg-red-500 rounded-full mx-auto animate-pulse shadow-2xl"></div>
                    </div>
                    <div className="bg-purple-300 rounded-2xl p-4 border-4 border-purple-600 transform rotate-1">
                      <p className="text-4xl font-black text-purple-800 animate-bounce"
                         style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        ⏰ {waitTimer} seconds remaining ⏰
                      </p>
                    </div>
                    <div className="bg-pink-300 rounded-2xl p-4 border-4 border-pink-600 transform -rotate-1">
                      <p className="text-xl font-bold text-pink-800 animate-pulse"
                         style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        Do not blink. Do not think. Just stare. 👁️👁️
                      </p>
                    </div>
                  </div>
                )}

                {/* Task 4: Name the Object */}
                {currentTask?.type === 'multiple' && currentTaskIndex === 3 && (
                  <div className="space-y-6">
                    <div className="bg-yellow-200 rounded-2xl p-6 border-4 border-yellow-600 transform rotate-1">
                      <div className="text-9xl animate-bounce">🧦</div>
                    </div>
                    <div className="bg-orange-300 rounded-2xl p-4 border-4 border-orange-600 transform -rotate-1">
                      <p className="text-2xl font-bold text-orange-800"
                         style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        Examine this mysterious object carefully... 🔍
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {OBJECT_OPTIONS.map((option) => (
                        <Button
                          key={option}
                          onClick={() => handleMultipleChoice(option)}
                          className={`text-xl py-4 font-black rounded-2xl border-4 transform hover:scale-105 transition-all duration-300 ${
                            selectedAnswer === option 
                              ? 'bg-yellow-400 text-purple-800 border-purple-600 animate-bounce' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-white/50'
                          }`}
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}
                        >
                          {option} 🤔
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task 5: Affirmations */}
                {currentTask?.type === 'click' && currentTaskIndex === 4 && (
                  <div className="space-y-6">
                    <div className="bg-pink-200 p-6 rounded-2xl border-4 border-pink-600 transform rotate-1">
                      <p className="text-3xl font-black text-pink-800 animate-pulse"
                         style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        💭 "{currentAffirmation}" 💭
                      </p>
                    </div>
                    <Button
                      onClick={handleAffirmationClick}
                      className="text-3xl px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black rounded-full border-8 border-white/50 animate-bounce transform hover:scale-110 transition-all duration-300 shadow-2xl"
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}
                    >
                      Say it! ({repeatCount}/5) 🗣️
                    </Button>
                    {repeatCount > 0 && (
                      <div className="bg-cyan-300 rounded-2xl p-3 border-4 border-cyan-600 transform -rotate-1">
                        <p className="text-lg font-bold text-cyan-800"
                           style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          Keep clicking to embrace your inner genius! 🌟
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-6">
                <Button
                  onClick={skipTask}
                  className="px-8 py-4 font-black border-4 border-red-600 text-red-700 bg-red-200 hover:bg-red-300 rounded-2xl transform hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}
                >
                  Skip Task (Cheater!) 😈
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
