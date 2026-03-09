import { useState, useEffect } from 'react';
import { User, Star } from 'lucide-react';

const mentors = [
  {
    id: 1,
    name: "Brig Sanjoy Ghosh",
    rank: "Ex-Army Officer",
    specialty: "GTO Expert",
    image: "/mentors/mentor1.jpg",
  },
  {
    id: 2,
    name: "Col Adi Bushiraja",
    rank: "Ex-Army Officer",
    specialty: "Psychology Expert",
    image: "/mentors/mentor2.jpg",
  },
  {
    id: 3,
    name: "Wing Commander Suresh Patel",
    rank: "Ex-Air Force Officer",
    specialty: "Interview Specialist",
    image: "/mentors/mentor3.jpg",
  },
  {
    id: 4,
    name: "Lt. Colonel Vikram Singh",
    rank: "Ex-Army Officer",
    specialty: "PPDT Expert",
    image: "/mentors/mentor4.jpg",
  },
  {
    id: 5,
    name: "Commander Priya Menon",
    rank: "Ex-Navy Officer",
    specialty: "TAT/WAT Expert",
    image: "/mentors/mentor5.jpg",
  },
  {
    id: 6,
    name: "Major General (Retd) Dhiraj Kohli",
    rank: "Ex-Army Officer",
    specialty: "SRT Expert",
    image: "/mentors/mentor6.jpg",
  },
  {
    id: 7,
    name: "Squadron Leader Ramesh Babu",
    rank: "Ex-Air Force Officer",
    specialty: "GTO Expert",
    image: "/mentors/mentor7.jpg",
  },
  {
    id: 8,
    name: "Captain Anjali Gupta",
    rank: "Ex-Army Officer",
    specialty: "Personality Development",
    image: "/mentors/mentor8.jpg",
  },
];

export function MentorsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mentors.length);
        setIsTransitioning(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleMentors = [];
  for (let i = 0; i < 4; i++) {
    const index = (currentIndex + i) % mentors.length;
    visibleMentors.push(mentors[index]);
  }

  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Meet Our Mentors
          </h2>
          <p className="text-xl text-slate-300 mb-4">
            Learn from officers who've walked the path
          </p>
          <div className="w-20 h-1 bg-green-500 mx-auto" />
        </div>

        {/* Auto-Scrolling Mentors */}
        <div className="relative">
          <div 
            className="flex justify-center gap-6 transition-all duration-500 ease-in-out"
            style={{
              transform: isTransitioning ? 'translateX(-100%)' : 'translateX(0)',
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            {visibleMentors.map((mentor, i) => (
              <div
                key={`${mentor.id}-${i}`}
                className="flex-shrink-0 w-64 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center relative">
                  <User className="w-20 h-20 text-slate-500" />
                  <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {mentor.rank}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 text-center">
                  <h4 className="font-bold text-lg text-white mb-1">
                    {mentor.name}
                  </h4>
                  <p className="text-green-400 text-sm">
                    {mentor.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {mentors.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === i ? 'bg-green-400 w-8' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-400">
            Our mentors have successfully cleared SSB and served in various capacities in the Indian Armed Forces.
          </p>
          <p className="text-slate-400 mt-2">
            They bring years of experience in training candidates for NDA, CDS, AFCAT, and TES entries.
          </p>
        </div>
      </div>
    </section>
  );
}
