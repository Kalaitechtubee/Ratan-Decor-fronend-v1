import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook to manage pending account status for Architect and Dealer users.
 * Provides utilities to check if user is pending and to guard restricted actions.
 */
export const usePendingAccount = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Check if the user has a pending account status
    const isPendingAccount = useCallback(() => {
        if (!user) return false;

        // Handle status and role defensively
        const status = (user.status || '').toString().toUpperCase();
        const role = (user.role || '').toString().toLowerCase();

        // This logic MUST only apply to trade roles (Architect/Dealer)
        const isTradeRole = role === 'architect' || role === 'dealer';
        if (!isTradeRole) return false;

        // For trade roles, any status other than 'APPROVED' is considered pending/restricted
        const isNotApproved = status !== 'APPROVED';

        // Explicit indicators of pending state
        const isPendingStatus = status === 'PENDING' || status === 'AWAITING' || status === '' || !user.status;

        return isNotApproved && isPendingStatus;
    }, [user]);

    // Check if user is logged in (including pending users)
    const isLoggedIn = useCallback(() => {
        return !!user && !!user.id;
    }, [user]);

    // Check if user has full access (approved or customer role)
    const hasFullAccess = useCallback(() => {
        if (!user) return false;
        const status = user.status?.toUpperCase();
        const role = user.role?.toLowerCase();

        // Customers always have full access
        if (role === 'customer') return true;

        // Architect/Dealer need approval
        return status === 'APPROVED';
    }, [user]);

    // Guard function to check if action is allowed
    // If not allowed, redirects to check-status page
    const guardRestrictedAction = useCallback((actionName = 'This action') => {
        if (isPendingAccount()) {
            toast.error(`${actionName} is not available while your account is pending approval.`, {
                duration: 4000,
                icon: '🔒',
            });
            navigate('/check-status', { replace: false });
            return false;
        }
        return true;
    }, [isPendingAccount, navigate]);

    // Wrapper to guard async actions
    const withPendingGuard = useCallback((action, actionName = 'This action') => {
        return async (...args) => {
            if (!guardRestrictedAction(actionName)) {
                return false;
            }
            return action(...args);
        };
    }, [guardRestrictedAction]);

    return {
        isPendingAccount,
        isLoggedIn,
        hasFullAccess,
        guardRestrictedAction,
        withPendingGuard,
        user,
        isAuthenticated,
    };
};

export default usePendingAccount;
