'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface Correction {
  id: number;
  title: string;
  description: string;
  severity: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

interface CorrectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CorrectionsModal({ isOpen, onClose }: CorrectionsModalProps) {
  const { user } = useUser();
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchCorrections();
    }
  }, [isOpen, user]);

  const fetchCorrections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/corrections');
      if (response.ok) {
        const data = await response.json();
        setCorrections(data);
      }
    } catch (error) {
      console.error('Error fetching corrections:', error);
      toast.error('Error fetching corrections');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Correcciones
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading corrections...</p>
            </div>
          ) : corrections.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">¡Perfecto!</h3>
              <p className="text-gray-500">No tienes correcciones pendientes. ¡Sigue así!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {corrections.map((correction) => (
                <div
                  key={correction.id}
                  className={`p-4 rounded-lg border ${
                    correction.isResolved
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{correction.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(correction.severity)}`}>
                        {correction.severity}
                      </span>
                      {correction.isResolved && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Resuelto
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{correction.description}</p>
                  <div className="text-xs text-gray-500">
                    <span>Fecha: {new Date(correction.createdAt).toLocaleDateString('es-ES')}</span>
                    {correction.isResolved && correction.resolvedAt && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Resuelto: {new Date(correction.resolvedAt).toLocaleDateString('es-ES')}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
