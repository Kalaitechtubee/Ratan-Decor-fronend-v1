import React, { useState, useEffect, useRef } from 'react';
import { History, UsersRound, Handshake, Layers } from 'lucide-react';
import PropTypes from 'prop-types';

const defaultStats = [
  {
    id: 'projects',
    value: 18,
    label: 'Years Experience',
    icon: History,
    suffix: '+',
  },
  {
    id: 'customers',
    value: 20,
    label: 'Expert Team Members',
    icon: UsersRound,
    suffix: '+',
  },
  {
    id: 'issues',
    value: 1100,
    label: 'Architects, Designers & Dealers Served',
    icon: Handshake,
    suffix: '',
  },
  {
    id: 'awards',
    value: 5500,
    label: 'Decorative Products Available',
    icon: Layers,
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

  const stats = apiStats || defaultStats;

  const formatNumber = (num) => {
    if (num >= 10000) return `${Math.floor(num / 1000)}k`;
    return num.toString();
  };

  const animateCounter = (id, targetValue) => {
    const duration = 2500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * targetValue);

      setCounters((prev) => ({ ...prev, [id]: currentValue }));

      if (progress < 1) {
        animationFrames.current[id] = requestAnimationFrame(step);
      } else {
        setCounters((prev) => ({ ...prev, [id]: targetValue }));
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

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      Object.values(animationFrames.current).forEach(cancelAnimationFrame);
    };
  }, [hasAnimated, stats]);

  return (
    <div className="bg-gray-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div ref={sectionRef} role="region" aria-label="Achievements Section">
          <div className="text-center">
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              Our <span className="text-[#ff4747]">Journey in Numbers</span>
            </h2>
            <p
              className={`text-xl text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              Numbers that reflect our experience, scale, and trust built with customers across India
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div
              className={`relative group transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <div className="absolute inset-0 bg-[#ff4747] rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative bg-white rounded-3xl p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=100"
                  alt="Luxury furniture showroom with wooden products and interior design"
                  className="w-full h-80 md:h-96 object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = 'https://media.istockphoto.com/id/2148914913/photo/foreman-talking-to-a-group-of-employees-while-manufacturing-a-chair.jpg?s=1024x1024&w=is&k=20&c=example-fallback';
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                const currentValue = counters[stat.id];

                return (
                  <div
                    key={stat.id}
                    className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    style={{ transitionDelay: `${700 + index * 200}ms` }}
                    role="figure"
                    aria-label={`${stat.label}: ${formatNumber(currentValue)}${stat.suffix}`}
                  >
                    <div className="absolute inset-0 bg-[#ff4747]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Responsive Layout: Horizontal on mobile, Vertical on sm+ */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-5 sm:gap-4">
                      {/* Icon - Always visible, scales on hover */}
                      <div className="flex-shrink-0 w-16 h-16 bg-[#ff4747] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                      </div>

                      {/* Number + Label */}
                      <div className="text-left flex-1 sm:flex-none p-3 sm:p-0">
                        <div
                          className={`text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 ${currentValue > 0 && currentValue < stat.value ? 'animate-pulse' : ''
                            }`}
                        >
                          {formatNumber(currentValue)}
                          <span className="text-[#ff4747]">{stat.suffix}</span>
                        </div>

                        <p className="text-gray-600 font-medium text-base sm:text-lg leading-tight !mb-0">
                          {stat.label}
                        </p>
                      </div>

                    </div>

                    {/* Bottom Progress Bar */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden mt-6"
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
                      />
                    </div>

                    {/* Pulsing Dot during animation */}
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

CounterComponent.propTypes = {
  apiStats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      suffix: PropTypes.string,
    })
  ),
};

export default CounterComponent;