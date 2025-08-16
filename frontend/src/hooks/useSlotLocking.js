// src/hooks/useSlotLocking.js
import { useState, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';

export const useSlotLocking = () => {
  const [lockedSlots, setLockedSlots] = useState([]);
  const [lockingSlot, setLockingSlot] = useState(false);

  const lockSlot = useCallback(async (slotId) => {
    if (lockedSlots.includes(slotId)) {
      return false;
    }

    setLockingSlot(true);
    try {
      await appointmentService.lockSlot(slotId);
      setLockedSlots(prev => [...prev, slotId]);
      
      // Auto-release slot after 5 minutes
      setTimeout(async () => {
        try {
          await appointmentService.releaseSlot(slotId);
          setLockedSlots(prev => prev.filter(id => id !== slotId));
        } catch (error) {
          console.error('Error auto-releasing slot:', error);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return true;
    } catch (error) {
      console.error('Error locking slot:', error);
      return false;
    } finally {
      setLockingSlot(false);
    }
  }, [lockedSlots]);

  const releaseSlot = useCallback(async (slotId) => {
    try {
      await appointmentService.releaseSlot(slotId);
      setLockedSlots(prev => prev.filter(id => id !== slotId));
      return true;
    } catch (error) {
      console.error('Error releasing slot:', error);
      return false;
    }
  }, []);

  return {
    lockedSlots,
    lockingSlot,
    lockSlot,
    releaseSlot
  };
};

