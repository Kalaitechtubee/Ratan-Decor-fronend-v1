import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Users, CheckCircle, Target } from 'lucide-react';
import PropTypes from 'prop-types';

const defaultStats = [
  {
    id: 'projects',
    value: 500,
    label: 'Projects Completed',
    icon: Trophy,
    suffix: '+',
  },
  {
    id: 'customers',
    value: 1000,
    label: 'Happy Customers',
    icon: Users,
    suffix: '+',
  },
  {
    id: 'issues',
    value: 0,
    label: 'Issues Resolved',
    icon: CheckCircle,
    suffix: '',
  },
  {
    id: 'awards',
    value: 25,
    label: 'Awards Won',
    icon: Target,
    suffix: '+',
  },
];

const CounterComponent = ({ apiStats }) => {
  const [counters, setCounters] = useState({
    projects: 0,
    customers: 0,
    issues: 0,
    awards: 0,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const animationFrames = useRef({});

  // Use API stats if provided, otherwise fallback to default
  const stats = apiStats || defaultStats;

  const formatNumber = (num) => {
    if (num >= 10000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };

  const animateCounter = (id, targetValue) => {
    const duration = 2500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * targetValue);

      setCounters((prev) => ({
        ...prev,
        [id]: currentValue,
      }));

      if (progress < 1) {
        animationFrames.current[id] = requestAnimationFrame(step);
      } else {
        setCounters((prev) => ({
          ...prev,
          [id]: targetValue, // Ensure exact final value
        }));
        delete animationFrames.current[id];
      }
    };

    animationFrames.current[id] = requestAnimationFrame(step);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          stats.forEach((stat, index) => {
            setTimeout(() => animateCounter(stat.id, stat.value), index * 200);
          });
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    const currentSection = sectionRef.current;
    if (currentSection) observer.observe(currentSection);

    return () => {
      if (currentSection) observer.unobserve(currentSection);
      Object.values(animationFrames.current).forEach((frame) =>
        cancelAnimationFrame(frame)
      );
    };
  }, [hasAnimated, stats]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 mb-2">
      <div className="max-w-7xl mx-auto">
        {/* Main Stats Section */}
        <div ref={sectionRef} className="scroll-trigger-section" role="region" aria-label="Achievements Section">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Our <span className="text-[#ff4747]">Achievements</span>
            </h2>
            <p
              className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Numbers that speak for our excellence and commitment to delivering outstanding results
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div
              className={`relative group transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="absolute inset-0 bg-[#ff4747] rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Team celebrating success"
                  className="w-full h-80 md:h-96 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute -top-4 -right-4 bg-[#ff4747] text-white px-6 py-3 rounded-2xl shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold">5+</div>
                    <div className="text-sm">Years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const currentValue = counters[stat.id];

                return (
                  <div
                    key={stat.id}
                    className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${700 + index * 200}ms` }}
                    role="figure"
                    aria-label={`${stat.label}: ${formatNumber(currentValue)}${stat.suffix}`}
                  >
                    <div className="absolute inset-0 bg-[#ff4747]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-[#ff4747] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className={`text-4xl md:text-5xl font-bold text-gray-900 mb-2 ${
                          currentValue > 0 && currentValue < stat.value ? 'animate-pulse' : ''
                        }`}
                      >
                        {formatNumber(currentValue)}
                        <span className="text-[#ff4747]">{stat.suffix}</span>
                      </div>
                      <p className="text-gray-600 font-medium text-lg">{stat.label}</p>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden"
                      role="progressbar"
                      aria-valuenow={currentValue}
                      aria-valuemin="0"
                      aria-valuemax={stat.value}
                    >
                      <div
                        className="h-full bg-[#ff4747] transition-all duration-2500 ease-out"
                        style={{
                          width: currentValue === stat.value ? '100%' : `${(currentValue / stat.value) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {currentValue > 0 && currentValue < stat.value && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-[#ff4747] rounded-full animate-ping" aria-hidden="true"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
CounterComponent.propTypes = {
  apiStats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      suffix: PropTypes.string.isRequired,
    })
  ),
};

export default CounterComponent;