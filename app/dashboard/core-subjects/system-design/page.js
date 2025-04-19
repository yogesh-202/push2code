'use client';
import { useState, useEffect } from 'react';
import { FaPlay, FaCheck } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SystemDesignPage() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProgress, setTotalProgress] = useState({
    completedLectures: 0,
    totalLectures: 0,
    progressPercentage: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCourseContent(token);
  }, [router]);

  const fetchCourseContent = async (token) => {
    try {
      const response = await fetch('/api/system-design/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch course content');
      }
      
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      // Safely set the modules and progress data
      setModules(data.modules || []);
      setTotalProgress({
        completedLectures: data.totalProgress?.completedLectures || 0,
        totalLectures: data.totalProgress?.totalLectures || 0,
        progressPercentage: data.totalProgress?.progressPercentage || 0
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching course content:', err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message || 'Failed to load course content');
    }
  };

  const handleVideoComplete = async (lectureId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/system-design/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lectureId,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      await fetchCourseContent(token);
      toast.success('Progress updated successfully');
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Content List Sidebar - Scrollable */}
      <div className="w-full md:w-1/4 bg-white overflow-y-auto border-r h-screen">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">System Design</h1>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Course Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {totalProgress.completedLectures} / {totalProgress.totalLectures} lectures completed
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${totalProgress.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            {modules.map((module) => (
              <div key={module.moduleNumber} className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  MODULE {module.moduleNumber}: {module.moduleName}
                </h2>
                <span className="text-sm text-gray-500">{module.duration}</span>
                
                {/* Debug log for lectures */}
                {console.log('Module lectures:', module.lectures)}
                
                <div className="mt-4 space-y-3">
                  {Array.isArray(module.lectures) && module.lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => setSelectedVideo(lecture)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
                        ${selectedVideo?.id === lecture.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {lecture.completed ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaPlay className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-800">{lecture.title}</h3>
                        <span className="text-xs text-gray-500">{lecture.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player Section - Fixed */}
      <div className="w-full md:w-3/4 bg-gray-900 h-screen overflow-hidden">
        <div className="h-full flex items-center justify-center p-6">
          {selectedVideo ? (
            <div className="w-full max-w-6xl aspect-video">
              <YouTube
                videoId={selectedVideo.videoId}
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                  }
                }}
                onEnd={() => handleVideoComplete(selectedVideo.id)}
                className="rounded-lg w-full h-full"
                containerClassName="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-gray-400">
              <p>Select a lecture to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 