import { useState, useEffect, useRef } from 'react';
import { Building2, ChefHat, Home, MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserType, closePopup } from '../../userType/userTypeSlice';
import { UserTypeAPI } from './UserTypeApi';
import api from '../../../services/axios';
import toast from 'react-hot-toast';

function UserTypePopup({ onClose, redirectToRegister = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { userType } = useSelector((state) => state.userType);
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const isMountedRef = useRef(true);
  const fetchAttemptedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    if (fetchAttemptedRef.current) {
      console.log('[UserTypePopup] Fetch already attempted, skipping');
      return;
    }

    const fetchUserTypes = async () => {
      fetchAttemptedRef.current = true;

      try {
        console.log('[UserTypePopup] Starting to fetch user types');
        const response = await UserTypeAPI.getAllUserTypes();
        
        if (!isMountedRef.current) {
          console.log('[UserTypePopup] Component unmounted, skipping state update');
          return;
        }

        if (response.data && Array.isArray(response.data)) {
          setUserTypes(response.data);
          setError('');
          console.log('[UserTypePopup] User types loaded:', {
            count: response.data.length,
            cached: response.cached || false,
            types: response.data.map(t => ({ 
              id: t.id,
              name: t.name, 
              hasIcon: !!t.iconUrl,
              iconUrl: t.iconUrl 
            }))
          });
        } else {
          throw new Error('Invalid user types data structure');
        }
      } catch (err) {
        console.error('[UserTypePopup] Error fetching user types:', err);
        if (!isMountedRef.current) return;
        setError('Failed to load user types. Please try again.');
        toast.error('Failed to load user types.');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchUserTypes();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      dispatch(closePopup());
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const handleSelectType = async (selectedType) => {
    if (isUpdating) {
      console.log('[UserTypePopup] Update in progress, ignoring click');
      return;
    }

    setIsUpdating(true);

    try {
      console.log('[UserTypePopup] Selecting user type:', selectedType);
      
      // Update Redux store first (this also updates localStorage)
      dispatch(setUserType(selectedType.name));

      // If authenticated, sync with backend
      if (isAuthenticated) {
        try {
          console.log('[UserTypePopup] Updating profile with userTypeId:', selectedType.id);
          
          // Update profile with the userTypeId
          await api.put('/auth/profile', { 
            userTypeId: selectedType.id,
            userType: selectedType.name // Include name for backward compatibility
          });
          
          console.log('[UserTypePopup] Server updated successfully');
          toast.success('User type updated successfully!');
          
          // Dispatch custom event to notify all components
          window.dispatchEvent(new CustomEvent('userTypeChanged', {
            detail: { 
              userType: selectedType.name,
              userTypeId: selectedType.id 
            }
          }));
          
        } catch (apiError) {
          console.error('[UserTypePopup] API Error:', apiError);
          toast.error('Failed to sync with server. Changes saved locally.');
        }
      } else {
        toast.success('User type updated!');
      }

      // Close popup
      handleClose();

      // Redirect if needed
      if (redirectToRegister) {
        setTimeout(() => {
          navigate('/register', { 
            state: { 
              selectedType: selectedType.name,
              selectedTypeId: selectedType.id 
            } 
          });
        }, 300);
      }
    } catch (err) {
      console.error('[UserTypePopup] Failed to update:', err);
      toast.error('Failed to update user type.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError('');
    fetchAttemptedRef.current = false;
    
    try {
      const response = await UserTypeAPI.getAllUserTypes(true);
      if (!isMountedRef.current) return;
      
      if (response.data && Array.isArray(response.data)) {
        setUserTypes(response.data);
        setError('');
      }
    } catch (err) {
      console.error('[UserTypePopup] Retry failed:', err);
      if (!isMountedRef.current) return;
      setError('Failed to load user types. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Component to handle icon with fallback
  const IconDisplay = ({ type }) => {
    const [imageError, setImageError] = useState(false);
    const iconClass = "w-10 h-10 sm:w-12 sm:h-12 text-[#ff4747]";

    // Show fallback if no iconUrl or if image failed to load
    if (!type.iconUrl || imageError) {
      const name = type.name.toLowerCase();
      
      if (name.includes('commercial')) {
        return <Building2 className={iconClass} />;
      } else if (name.includes('modular') || name.includes('kitchen')) {
        return <ChefHat className={iconClass} />;
      } else if (name.includes('residential')) {
        return <Home className={iconClass} />;
      } else {
        return <MoreHorizontal className={iconClass} />;
      }
    }

    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
        <img
          src={type.iconUrl}
          alt={`${type.name} icon`}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.warn(`[UserTypePopup] Failed to load icon for ${type.name}:`, type.iconUrl);
            setImageError(true);
          }}
          onLoad={() => {
            console.log(`[UserTypePopup] Icon loaded successfully for ${type.name}`);
          }}
        />
      </div>
    );
  };

  // Check if a type is currently selected (case-insensitive comparison)
  const isTypeSelected = (typeName) => {
    return userType?.toLowerCase() === typeName?.toLowerCase();
  };

  if (loading) {
    return (
      <div 
        className={`fixed inset-0 z-[1000] flex justify-center items-center bg-black p-3 transition-all duration-300 ${
          isVisible ? 'bg-opacity-60' : 'bg-opacity-0'
        }`}
      >
        <div 
          className={`p-4 bg-white rounded-xl shadow-xl max-w-[300px] w-full transform transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-[#ff4747] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading user types...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex justify-center items-center bg-black p-3 transition-all duration-300 ${
        isVisible && !isClosing ? 'bg-opacity-60' : 'bg-opacity-0'
      }`}
    >
      <div 
        className={`relative px-6 py-5 sm:px-7 sm:py-6 w-full max-w-[400px] sm:max-w-[480px] md:max-w-[560px] max-h-[600px] bg-white rounded-xl shadow-xl overflow-y-auto transform transition-all duration-300 ${
          isVisible && !isClosing ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >


        <div className="mb-4 text-center">
          <h2 className={`mb-2 text-xl sm:text-2xl font-bold text-gray-900 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            {redirectToRegister ? 'Welcome to Ratan Decor!' : 'Select Your User Type'}
          </h2>
          <p className={`text-sm sm:text-base text-gray-600 transition-all duration-500 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            Choose your project type
          </p>
          
          {redirectToRegister && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200 transition-all duration-500 delay-200">
              <p className="text-sm sm:text-base text-blue-700">
                You'll be redirected to register after selection
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-200 animate-shake">
              <p className="text-sm sm:text-base text-red-700 mb-3">{error}</p>
              <button onClick={handleRetry} className="text-sm font-medium text-red-600 hover:text-red-700 underline">
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {userTypes
            .filter(type => type.name.toLowerCase() !== 'general')
            .map((type, index) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type)}
              disabled={isUpdating}
              className={`group relative py-4 sm:py-5 px-3 sm:px-4 rounded-lg border transition-all duration-300 text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                isTypeSelected(type.name)
                  ? 'bg-[#ff4747]/10 border-[#ff4747] shadow-md ring-2 ring-[#ff4747]/50'
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-[#ff4747] hover:shadow-lg hover:-translate-y-1'
              } ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${300 + index * 100}ms`
              }}
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff4747] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  <IconDisplay type={type} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#ff4747] transition-colors">
                  {type.name}
                </h3>
                {type.description && (
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block mt-1 line-clamp-2 px-2">
                    {type.description.length > 40 
                      ? type.description.substring(0, 40) + '...' 
                      : type.description}
                  </p>
                )}
                {isTypeSelected(type.name) && (
                  <div className="mt-2 flex items-center text-[#ff4747] text-xs font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Current
                  </div>
                )}
              </div>
              
              {isUpdating && isTypeSelected(type.name) && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[#ff4747] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className={`mt-4 sm:mt-5 text-center transition-all duration-500 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm sm:text-base text-gray-600">
              You can change this selection anytime from your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTypePopup;