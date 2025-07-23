import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MessageCircle, Mic, MicOff, Star, Smile, ArrowLeft } from 'lucide-react';

interface DailyCompanionProps {
  onBack?: () => void;
}

interface DailyMoment {
  id: string;
  name: string;
  date: string;
  moments: string[];
  mood: string;
  recorded: boolean;
  createdAt: string;
  updatedAt: string;
}

const DailyCompanion = ({ onBack }: DailyCompanionProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState<{ [key: string]: DailyMoment[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentMoments, setCurrentMoments] = useState(['', '', '']);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [userName, setUserName] = useState('');
  const [companionMessage, setCompanionMessage] = useState('');

  const warmGreetings = [
    "สวัสดีค่ะ! วันนี้เป็นอย่างไรบ้าง? 😊",
    "ยินดีที่ได้เจอกันอีกครั้งนะคะ ✨",
    "หวังว่าวันนี้จะเป็นวันที่ดีสำหรับคุณ 💕",
    "มาเล่าให้ฟังกันเถอะว่าวันนี้มีอะไรดี 🌸"
  ];

  const companionResponses = [
    "ฟังแล้วอบอุ่นใจจัง! ขอบคุณที่แบ่งปันให้ฟังนะคะ 💝",
    "เรื่องราวของคุณทำให้ฉันมีความสุขด้วย 🌺",
    "คุณช่างเป็นคนที่เก่งมากในการหาความสุขเล็กๆ ใหญ่ๆ ✨",
    "วันพรุ่งนี้อยากฟังเรื่องใหม่ๆ อีกนะคะ 💕"
  ];

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // API functions
  const fetchDailyMoments = async (date?: string) => {
    try {
      setIsLoading(true);
      const url = date ? `/api/daily-moments?date=${encodeURIComponent(date)}` : '/api/daily-moments';
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (date) {
          setJournalEntries(prev => ({ ...prev, [date]: Array.isArray(data) ? data : [data] }));
        } else {
          const entriesMap: { [key: string]: DailyMoment[] } = {};
          data.forEach((entry: DailyMoment) => {
            if (!entriesMap[entry.date]) {
              entriesMap[entry.date] = [];
            }
            entriesMap[entry.date].push(entry);
          });
          setJournalEntries(entriesMap);
        }
      }
    } catch (error) {
      console.error('Error fetching daily moments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDailyMoments = async (date: string, moments: string[], mood: string = 'happy', name: string) => {
    try {
      setIsLoading(true);
      
      // Always create new entry for each person
      const response = await fetch('/api/daily-moments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          date,
          moments: moments.filter(m => m.trim()),
          mood
        }),
      });

      if (response.ok) {
        const savedEntry = await response.json();
        // Add to existing entries for this date
        setJournalEntries(prev => ({
          ...prev,
          [date]: prev[date] ? [...prev[date], savedEntry] : [savedEntry]
        }));
        return savedEntry;
      } else {
        console.error('Failed to save daily moments');
      }
    } catch (error) {
      console.error('Error saving daily moments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    fetchDailyMoments();
    
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = "สวัสดีตอนเช้าค่ะ! หวังว่าจะเป็นวันที่ดี 🌅";
    } else if (hour < 17) {
      greeting = "สวัสดีตอนบ่ายค่ะ! วันนี้เป็นอย่างไรบ้าง? ☀️";
    } else {
      greeting = "สวัสดีตอนเย็นค่ะ! มาเล่าเรื่องดีๆ ของวันนี้กันเถอะ 🌙";
    }
    setCompanionMessage(greeting);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const startJournaling = () => {
    setShowNamePrompt(true);
    setCompanionMessage("เอาล่ะ เริ่มต้นด้วยการแนะนำตัวกันก่อนนะคะ 😊");
  };

  const startMomentsAfterName = () => {
    if (userName.trim()) {
      setShowNamePrompt(false);
      setShowJournalPrompt(true);
      setCurrentMomentIndex(0);
      setCompanionMessage(`สวัสดีคุณ${userName}! มาเล่าเรื่องดีๆ ของวันนี้กันเถอะ ✨`);
    }
  };

  const saveCurrentMoment = async () => {
    if (currentMoments[currentMomentIndex].trim()) {
      if (currentMomentIndex < 2) {
        setCurrentMomentIndex(currentMomentIndex + 1);
        setCompanionMessage(`เรื่องที่ ${currentMomentIndex + 2} ล่ะคะ? 😊`);
      } else {
        // Save all moments to backend
        const today = new Date().toDateString();
        const filteredMoments = currentMoments.filter(m => m.trim());
        
        await saveDailyMoments(today, filteredMoments, "happy", userName);
        
        setShowJournalPrompt(false);
        setCurrentMoments(['', '', '']);
        setCurrentMomentIndex(0);
        setUserName('');
        const response = companionResponses[Math.floor(Math.random() * companionResponses.length)];
        setCompanionMessage(response);
      }
    }
  };

  const handleMomentChange = (value: string) => {
    const newMoments = [...currentMoments];
    newMoments[currentMomentIndex] = value;
    setCurrentMoments(newMoments);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMomentChange(e.target.value);
  };


  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setCompanionMessage("กำลังฟังอยู่ค่ะ... พูดได้เลย 🎤");
    } else {
      setCompanionMessage("ขอบคุณค่ะ! ถ้าอยากเพิ่มอะไรอีกก็บอกได้นะ 😊");
    }
  };

  const selectedEntries = journalEntries[selectedDate.toDateString()] || [];
  const todayEntries = journalEntries[new Date().toDateString()] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <div className="mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={20} />
              กลับ
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-500 mr-3" size={40} />
            <h1 className="text-4xl font-bold text-purple-800">เพื่อนคู่ใจ</h1>
            <Heart className="text-pink-500 ml-3" size={40} />
          </div>
          <p className="text-lg text-purple-600">แบ่งปันความสุขของทุกวันกับเรา 💕</p>
        </div>

        {/* Companion Message */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-pink-400">
          <div className="flex items-start">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-full p-3 mr-4">
              <Smile className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">เพื่อนคุยของคุณ</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{companionMessage}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Journal */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Star className="mr-2 text-yellow-500" size={24} />
              เรื่องดีๆ ของวันนี้
            </h2>
            
            {!showNamePrompt && !showJournalPrompt && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <MessageCircle className="mx-auto text-purple-400" size={64} />
                </div>
                <p className="text-gray-600 mb-4">
                  {todayEntries.length > 0 ? "อยากเล่าเรื่องดีๆ เพิ่มเติมมั้ยคะ?" : "พร้อมแบ่งปันเรื่องดีๆ ของวันนี้หรือยัง?"}
                </p>
                <button
                  onClick={startJournaling}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                >
                  {todayEntries.length > 0 ? "📝 เล่าเพิ่ม" : "📝 เล่าให้ฟังสิ"}
                </button>
              </div>
            )}

            {showNamePrompt && (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-2">
                    ขอทราบชื่อหน่อยนะคะ:
                  </h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && startMomentsAfterName()}
                      placeholder="ใส่ชื่อของคุณ..."
                      className="flex-1 px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
                      autoFocus
                    />
                    <button
                      onClick={startMomentsAfterName}
                      disabled={!userName.trim() || isLoading}
                      className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ต่อไป
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showJournalPrompt && (
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-2">
                    เรื่องดีๆ ที่ {currentMomentIndex + 1}:
                  </h3>
                  
                  {/* Quick Choice Buttons */}
                  <div className="mb-3">
                    <p className="text-sm text-purple-600 mb-2">เลือกหรือพิมพ์เอง:</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        "ลูกหลานโทรมา", "เพื่อนมาเยี่ยม", "สุขภาพดี", "อาหารอร่อย",
                        "สวนสวย", "อากาศดี", "นอนหลับสบาย", "ดูทีวีสนุก",
                        "ไปวัด", "ออกกำลังกาย", "อ่านหนังสือ", "ฟังเพลง"
                      ].map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleMomentChange(choice)}
                          className="bg-white border border-purple-200 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentMoments[currentMomentIndex] || ''}
                      onChange={handleInputChange}
                      onKeyDown={(e) => e.key === 'Enter' && saveCurrentMoment()}
                      placeholder="หรือพิมพ์เรื่องดีๆ เอง..."
                      className="flex-1 px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
                      autoFocus
                    />
                    <button
                      onClick={toggleRecording}
                      className={`p-3 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  </div>
                  <button
                    onClick={saveCurrentMoment}
                    disabled={isLoading}
                    className="mt-3 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'กำลังบันทึก...' : (currentMomentIndex < 2 ? 'ต่อไป' : 'เสร็จแล้ว')}
                  </button>
                </div>
                
                {/* Show previous moments */}
                {currentMomentIndex > 0 && (
                  <div className="space-y-2">
                    {currentMoments.slice(0, currentMomentIndex).map((moment, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                        <span className="text-green-800">{index + 1}. {moment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {todayEntries.length > 0 && !showNamePrompt && !showJournalPrompt && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="text-center pb-2">
                  <div className="text-purple-600 font-medium">✨ เรื่องดีๆ ของวันนี้ ✨</div>
                  <p className="text-sm text-gray-600 mt-1">มี {todayEntries.length} คนแบ่งปันความสุข</p>
                </div>
                {todayEntries.map((entry) => (
                  <div key={entry.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm">
                    <div className="text-sm text-purple-600 font-medium mb-2">
                      👤 {entry.name}
                    </div>
                    <div className="space-y-2">
                      {entry.moments.map((moment, momentIndex) => (
                        <div key={momentIndex} className="text-gray-800">
                          <span className="text-yellow-500">✦</span> {moment}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(entry.createdAt).toLocaleTimeString('th-TH')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar & Memory */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="mr-2 text-purple-500" size={24} />
              ความทรงจำดีๆ
            </h2>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  ←
                </button>
                <h3 className="text-lg font-semibold text-purple-800">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  →
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayEntries = day ? journalEntries[day.toDateString()] : null;
                  const hasEntries = dayEntries && dayEntries.length > 0;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (day) {
                          setSelectedDate(day);
                          const dateString = day.toDateString();
                          if (!journalEntries[dateString]) {
                            fetchDailyMoments(dateString);
                          }
                        }
                      }}
                      className={`p-2 text-sm rounded hover:bg-purple-100 relative ${
                        day ? 'text-gray-700' : 'text-gray-300'
                      } ${
                        day && day.toDateString() === selectedDate.toDateString() 
                          ? 'bg-purple-500 text-white' 
                          : ''
                      } ${
                        day && day.toDateString() === new Date().toDateString() 
                          ? 'ring-2 ring-purple-300' 
                          : ''
                      }`}
                    >
                      {day ? day.getDate() : ''}
                      {hasEntries && (
                        <div className="absolute bottom-0 right-0 flex items-center">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          {dayEntries.length > 1 && (
                            <span className="text-xs font-bold text-pink-600 ml-0.5">
                              {dayEntries.length}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Memories */}
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p>กำลังโหลด...</p>
              </div>
            ) : selectedEntries.length > 0 ? (
              <div className="bg-purple-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                <h3 className="font-semibold text-purple-800 mb-3">
                  {selectedDate.toLocaleDateString('th-TH')}
                  <span className="text-sm font-normal text-purple-600 ml-2">
                    ({selectedEntries.length} คน)
                  </span>
                </h3>
                <div className="space-y-4">
                  {selectedEntries.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-sm text-purple-600 font-medium mb-2">
                        👤 {entry.name}
                      </div>
                      <div className="space-y-1 mb-2">
                        {entry.moments.map((moment: string, momentIndex: number) => (
                          <div key={momentIndex} className="text-gray-700 text-sm">
                            <span className="text-purple-600">✦</span> {moment}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString('th-TH')}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-purple-600 italic text-center mt-3">
                  ความสุขที่แบ่งปันในวันนี้ 💕
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <Calendar className="mx-auto mb-2 text-gray-300" size={32} />
                <p>เลือกวันที่เพื่อดูความทรงจำ</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default DailyCompanion;