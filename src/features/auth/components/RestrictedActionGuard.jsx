import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingAccount } from '../hooks/usePendingAccount';
import toast from 'react-hot-toast';

/**
 * A wrapper component that guards children from pending users.
 * If the user has a pending account, clicking triggers a redirect to check-status.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The child element to render
 * @param {string} props.actionName - Name of the action being guarded (for toast message)
 * @param {function} props.onClick - Original onClick handler to call if user has access
 * @param {boolean} props.showDisabled - If true, shows a disabled state for pending users
 * @param {string} props.className - Additional class names
 */
export const RestrictedActionGuard = ({
    children,
    actionName = 'This action',
    onClick,
    showDisabled = false,
    className = '',
    ...props
}) => {
    const { user, isPendingAccount, guardRestrictedAction } = usePendingAccount();
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (isPendingAccount()) {
            e.preventDefault();
            e.stopPropagation();

            navigate('/enquiry-form', { replace: false });
            return;
        }

        if (onClick) {
            onClick(e);
        }
    };

    // If showDisabled is true and user is pending, add visual indication
    const isPending = isPendingAccount();
    const combinedClassName = `${className} ${isPending && showDisabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim();

    return React.cloneElement(React.Children.only(children), {
        onClick: handleClick,
        className: combinedClassName || children.props.className,
        ...props,
    });
};

/**
 * Higher-order component to wrap any component with pending account protection.
 * The wrapped component will redirect pending users to check-status page.
 * 
 * @param {React.ComponentType} WrappedComponent - Component to wrap
 * @param {string} actionName - Name of the action for error message
 */
export const withRestrictedAccess = (WrappedComponent, actionName = 'This action') => {
    return function ProtectedComponent(props) {
        const { isPendingAccount } = usePendingAccount();
        const navigate = useNavigate();

        const handleRestrictedClick = (originalHandler) => (e) => {
            if (isPendingAccount()) {
                e?.preventDefault?.();
                e?.stopPropagation?.();

                navigate('/check-status', { replace: false });
                return;
            }

            if (originalHandler) {
                originalHandler(e);
            }
        };

        // Inject the guard into onClick prop
        const guardedProps = {
            ...props,
            onClick: props.onClick ? handleRestrictedClick(props.onClick) : undefined,
        };

        return <WrappedComponent {...guardedProps} />;
    };
};

export default RestrictedActionGuard;
