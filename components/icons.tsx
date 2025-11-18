
import React from 'react';
import { FiAlertTriangle, FiHeart, FiShield, FiSend, FiSun, FiMoon, FiLifeBuoy } from 'react-icons/fi';

const iconSize = "1.3rem";

export const EmergencyIcon: React.FC = () => <FiAlertTriangle size={iconSize} />;
export const VolunteerIcon: React.FC = () => <FiHeart size={iconSize} />;
export const SafetyIcon: React.FC = () => <FiShield size={iconSize} />;
export const SuicidePreventionIcon: React.FC = () => <FiLifeBuoy size={iconSize} />;
export const SendIcon: React.FC = () => <FiSend size={"1.2rem"} />;
export const SunIcon: React.FC = () => <FiSun size="1.2rem" />;
export const MoonIcon: React.FC = () => <FiMoon size="1.2rem" />;
