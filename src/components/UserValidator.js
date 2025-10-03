import React from 'react';
import { useUserValidation } from '../hooks/useUserValidation';

const UserValidator = ({ children }) => {
  useUserValidation();
  return <>{children}</>;
};

export default UserValidator;