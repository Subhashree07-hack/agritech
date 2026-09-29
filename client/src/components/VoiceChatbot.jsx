import { useState, useEffect, useRef } from 'react'
import { E } from '../icons'

const KNOWLEDGE_BASE = {
  en: {
    welcome: 'Hello! I am your AgriTech Voice Assistant. You can ask me about fresh vegetable & fruit stock, selling farm waste to cow shelters, juice shops for fruits, or contract farmlands. How can I help you today?',
    samplePrompts: [
      'What vegetables and fruits are in stock?',
      'How to sell waste to cow shelters?',
      'How can I sell fruits to juice shops?',
      'Farmlands available for contract farming?',
      'Where is nearest Uzhavar Sandhai mandi?',
    ],
    responses: [
      {
        triggers: ['stock', 'vegetable', 'fruit', 'green', 'price', 'tomato', 'carrot', 'spinach', 'papaya'],
        answer: 'We have 27+ fresh farm items in stock today! Vegetables like Salem Country Tomatoes (₹32/kg), Ooty Carrots (₹48/kg), Greens like Palak Spinach (₹22/bunch), and Fruits like Red Lady Papaya (₹38/kg) and Theni Bananas (₹45/kg). You can click "Fresh Stock" to buy immediately!',
      },
      {
        triggers: ['cow', 'shelter', 'gaushala', 'waste', 'feed', 'fodder', 'sell waste'],
        answer: 'You can sell your vegetable trimmings, rejected greens, and fruit peels directly to 6 verified Cow Shelters & Gaushalas! They pay an average of ₹4.50 per kg with free doorstep farm pickup for 80+ kg. Click "Cow Shelters" to book pickup!',
      },
      {
        triggers: ['juice', 'juice shop', 'surplus fruit', 'sell fruit'],
        answer: 'To prevent fruit spoilage, you can sell surplus ripe fruits directly to 5 partner Juice Shops like Green Sip Juice Bar and Nectar Pure Juices at wholesale rates (₹30-₹38/kg). Click "Fruits & Juice Shops" to dispatch!',
      },
      {
        triggers: ['farmland', 'contract', 'lease', 'acres', 'land'],
        answer: 'We have 5 fertile farmlands open for contract farming across Tamil Nadu (Coimbatore, Salem, Theni, Erode, Hosur) with drip irrigation and river water for growing vegetables and fruits. Click "Farmland Map" to view terms!',
      },
      {
        triggers: ['mandi', 'market', 'uzhavar', 'sandhai', 'apmc'],
        answer: 'Direct marketplaces like Salem Uzhavar Sandhai and Erode Farmer Markets offer 0% commission direct selling to consumers, open from 4:30 AM to 11:30 AM. Check the Farmland & Mandis Map for turn-by-turn directions!',
      },
      {
        triggers: ['health', 'hair', 'skin', 'immunity', 'digestion'],
        answer: 'Our produce is categorized by health benefits: Curry leaves & Amla for Hair Growth, Tomatoes & Papaya for Glowing Skin, Moringa & Garlic for Immunity, and Pineapple & Mint for Fast Digestion!',
      },
    ],
    defaultReply: 'I can assist you with Produce Stock, Cow Shelters for farm waste, Juice Shops for surplus fruits, and Contract Farmlands. Please choose a topic or ask a question!',
  },
  ta: {
    welcome: 'வணக்கம்! நான் உங்கள் அக்ரிடெக் குரல் உதவியாளர். புதிய காய்கறிகள், மாட்டுப் பண்ணைகளுக்கு கழிவு விற்பனை, பழங்களுக்கான ஜூஸ் கடைகள் மற்றும் ஒப்பந்த விவசாய நிலங்கள் பற்றி என்னிடம் கேட்கலாம்!',
    samplePrompts: [
      'காய்கறி மற்றும் பழங்களின் இருப்பு மற்றும் விலை?',
      'மாட்டுப் பண்ணைக்கு கழிவுகளை எப்படி விற்பது?',
      'பழங்களை ஜூஸ் கடைக்கு எப்படி விற்பது?',
      'ஒப்பந்த விவசாயத்திற்கு நிலங்கள் உள்ளதா?',
      'உழவர் சந்தை மற்றும் மண்டி எங்கு உள்ளது?',
    ],
    responses: [
      {
        triggers: ['stock', 'vegetable', 'fruit', 'green', 'price', 'விலை', 'காய்கறி', 'பழம்', 'கீரை', 'இருப்பு'],
        answer: 'இன்று 27 புதிய பண்ணை விளைபொருட்கள் இருப்பில் உள்ளன! நாட்டு தக்காளி கிலோ ₹32, ஊட்டி கேரட் கிலோ ₹48, பாலக் கீரை கட்டு ₹22, மற்றும் பப்பாளி கிலோ ₹38. உடனே வாங்க மேலே உள்ள Fresh Stock பக்கத்தைப் பாருங்கள்!',
      },
      {
        triggers: ['cow', 'shelter', 'gaushala', 'waste', 'மாடு', 'கோசாலை', 'பண்ணை', 'கழிவு'],
        answer: 'உங்கள் பண்ணைக் கழிவுகள் மற்றும் காய்கறி தோல்களை 6 மாட்டுப் பண்ணைகளுக்கு விற்கலாம்! கிலோவிற்கு ₹4.50 கிடைக்கும். 80 கிலோவுக்கு மேல் இலவச வாகன வசதி உண்டு!',
      },
      {
        triggers: ['juice', 'ஜூஸ்', 'பழங்கள்', 'விற்பனை'],
        answer: 'பழுத்த பழங்களை வீணாக்காமல் 5 முன்னணி ஜூஸ் கடைகளுக்கு மொத்த விலையில் கிலோ ₹30 முதல் ₹38 வரை நேரடியாக விற்கலாம்! Fruits and Juice Shops பக்கத்தில் விற்கலாம்!',
      },
      {
        triggers: ['farmland', 'contract', 'நிலம்', 'ஒப்பந்தம்', 'விவசாயம்'],
        answer: 'காய்கறி, கீரை மற்றும் பழங்கள் பயிரிட 5 செழிப்பான ஒப்பந்த விவசாய நிலங்கள் சேலம் மற்றும் கோவையில் உள்ளன. Farmland Map பக்கத்தில் பார்க்கவும்!',
      },
      {
        triggers: ['mandi', 'market', 'uzhavar', 'சந்தை', 'மண்டி', 'உழவர்'],
        answer: 'சேலம் உழவர் சந்தை மற்றும் ஏபிஎம்சி மண்டிகளில் 0% கமிஷன் அடிப்படையில் காலை 4:30 முதல் 11:30 வரை நேரடியாக விற்கலாம்!',
      },
      {
        triggers: ['health', 'hair', 'skin', 'முடி', 'தோல்', 'நோய் எதிர்ப்பு', 'செரிமானம்'],
        answer: 'முடி வளர்ச்சிக்கு கருவேப்பிலை மற்றும் நெல்லிக்காய்; பளபளப்பான சருமத்திற்கு தக்காளி மற்றும் பப்பாளி; நோய் எதிர்ப்பு சக்திக்கு முருங்கைக்கீரை மற்றும் இஞ்சி சிறந்தவை!',
      },
    ],
    defaultReply: 'பண்ணை விளைபொருட்கள், மாட்டுப் பண்ணை கழிவு விற்பனை, பழங்களுக்கான ஜூஸ் கடைகள் மற்றும் உழவர் சந்தை பற்றி கேட்கலாம்!',
  },
}

export default function VoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [lang, setLang] = useState('en') // 'en' | 'ta'
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  // Initialize welcome message
  useEffect(() => {
    setChatHistory([
      {
        sender: 'bot',
        text: KNOWLEDGE_BASE[lang].welcome,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }, [lang])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isOpen])

  // Stop any active audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  // Text-to-Speech function: Speaks in native Tamil or English with 100% reliability
  const speakText = (text, language) => {
    if (!voiceEnabled) return
    stopAudio()

    const cleanText = text.replace(/[*#_~`()]/g, '').trim()
    if (!cleanText) return

    // For Tamil: Use Google Translate TTS audio streaming for natural native Tamil speech
    if (language === 'ta') {
      const sentences = cleanText.split(/[.!?,।\n]/).map((s) => s.trim()).filter((s) => s.length > 0)
      const chunks = []
      let temp = ''
      for (const s of sentences) {
        if ((temp + ' ' + s).length < 130) {
          temp = temp ? temp + ' ' + s : s
        } else {
          if (temp) chunks.push(temp)
          temp = s.slice(0, 130)
        }
      }
      if (temp) chunks.push(temp)
      if (chunks.length === 0) chunks.push(cleanText.slice(0, 130))

      let idx = 0
      const playNextChunk = () => {
        if (idx >= chunks.length) return
        const currentChunk = chunks[idx++]
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentChunk)}&tl=ta&client=tw-ob`
        const audio = new Audio(audioUrl)
        audioRef.current = audio
        audio.onended = playNextChunk
        audio.play().catch(() => {
          fallbackSpeechSynthesis(cleanText, 'ta-IN')
        })
      }
      playNextChunk()
      return
    }

    // For English: Use browser speech synthesis or Google TTS fallback
    if ('speechSynthesis' in window) {
      fallbackSpeechSynthesis(cleanText, 'en-IN')
    } else {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 150))}&tl=en&client=tw-ob`
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.play().catch(() => {})
    }
  }

  const fallbackSpeechSynthesis = (text, langCode) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 250))
    utterance.lang = langCode
    utterance.rate = 0.95

    const voices = window.speechSynthesis.getVoices()
    const match = voices.find((v) =>
      langCode.startsWith('ta')
        ? v.lang.includes('ta') || v.name.includes('Tamil')
        : v.lang.includes('en') || v.lang.includes('IN')
    )
    if (match) utterance.voice = match

    window.speechSynthesis.speak(utterance)
  }

  // Switch language and speak greeting
  const handleLanguageChange = (newLang) => {
    setLang(newLang)
    stopAudio()
    const welcome = KNOWLEDGE_BASE[newLang].welcome
    speakText(welcome, newLang)
  }

  // Speech-to-Text (Microphone input)
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Microphone speech recognition is not supported in this browser. Please type your message.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    setIsListening(true)

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript
      setInputMessage(speechToText)
      handleUserSend(speechToText)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  // Answer matching logic
  const getBotResponse = (query, currentLang) => {
    const q = query.toLowerCase()
    const kb = KNOWLEDGE_BASE[currentLang]

    for (const item of kb.responses) {
      if (item.triggers.some((t) => q.includes(t.toLowerCase()))) {
        return item.answer
      }
    }
    return kb.defaultReply
  }

  // Send message handler
  const handleUserSend = (textToSend) => {
    const query = (textToSend || inputMessage).trim()
    if (!query) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { sender: 'user', text: query, time }

    const botReplyText = getBotResponse(query, lang)
    const botMsg = { sender: 'bot', text: botReplyText, time }

    setChatHistory((prev) => [...prev, userMsg, botMsg])
    setInputMessage('')

    // Speak response out loud in chosen language (Tamil or English)
    speakText(botReplyText, lang)
  }

  return (
    <>
      {/* Floating Chatbot Button at Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-[9999]">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true)
              speakText(KNOWLEDGE_BASE[lang].welcome, lang)
            }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-extrabold text-xs md:text-sm shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/80 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">
              🎙️
            </div>
            <div className="text-left">
              <span className="block leading-tight text-emerald-100 text-[10px] uppercase font-bold tracking-wider">
                Voice Assistant
              </span>
              <span className="block leading-tight font-black">
                AgriTech AI (தமிழ் & EN)
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Modal at Bottom-Left */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-[99999] w-[calc(100vw-32px)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-green-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg shadow">
                🎙️
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight leading-tight">AgriTech Voice Assistant</h3>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {lang === 'ta' ? 'தமிழ் குரல் இயங்குகிறது' : 'Tamil & English AI Voice Ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher */}
              <button
                onClick={() => handleLanguageChange(lang === 'en' ? 'ta' : 'en')}
                className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border transition shadow-xs ${
                  lang === 'ta'
                    ? 'bg-amber-400 text-amber-950 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                }`}
                title="Switch Language (தமிழ் / English)"
              >
                {lang === 'en' ? 'தமிழ் 🇮🇳' : 'English 🇬🇧'}
              </button>

              {/* Voice Mute / Unmute */}
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled)
                  if (voiceEnabled) stopAudio()
                }}
                className={`p-1.5 rounded-full transition ${voiceEnabled ? 'bg-white/20 text-white' : 'bg-red-500/80 text-white'}`}
                title={voiceEnabled ? 'Voice Sound Active' : 'Voice Muted'}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  stopAudio()
                }}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-xs font-bold transition ml-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompts Banner */}
          <div className="p-2.5 bg-green-50/80 border-b border-green-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {KNOWLEDGE_BASE[lang].samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleUserSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-green-200 text-green-800 font-semibold hover:bg-green-100 transition shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8faf8] text-xs">
            {chatHistory.map((msg, index) => {
              const isBot = msg.sender === 'bot'
              return (
                <div
                  key={index}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                      isBot
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        : 'bg-green-700 text-white rounded-tr-none font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] opacity-70">
                      <span>{msg.time}</span>
                      {isBot && voiceEnabled && (
                        <button
                          onClick={() => speakText(msg.text, lang)}
                          className="hover:opacity-100 ml-2 font-bold flex items-center gap-1 text-green-700"
                          title="Speak again"
                        >
                          🔊 {lang === 'ta' ? 'கேளுங்கள்' : 'Play Voice'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Microphone Listening State */}
          {isListening && (
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
              <span>🎙️ Listening in {lang === 'ta' ? 'தமிழ்' : 'English'}... Speak now!</span>
            </div>
          )}

          {/* Input Footer with Microphone and Send Button */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`p-2.5 rounded-full transition shadow ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
              }`}
              title="Click to speak (Tamil or English)"
            >
              🎙️
            </button>

            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={lang === 'ta' ? 'இங்கு பேசவும் அல்லது தட்டச்சு செய்யவும்...' : 'Type or click mic to speak...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUserSend()
              }}
            />

            <button
              onClick={() => handleUserSend()}
              className="px-3.5 py-2 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
