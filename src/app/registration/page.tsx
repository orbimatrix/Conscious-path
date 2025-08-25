import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-[#94520C] mb-6 font-['Lato']">
            Iniciar la Senda Consciente
          </h1>
          
        </div>

        <div className="max-w-md mx-auto">
          <SignedOut>
            <div className="bg-white rounded-2xl shadow-xl p-8 border ">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Bienvenido
                </h2>
                <p className="text-gray-600">
                  Elige cómo quieres comenzar tu camino
                </p>
              </div>

              <div className="space-y-4">
                <SignUpButton>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Crear Cuenta Gratuita
                  </button>
                </SignUpButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>

                <SignInButton>
                  <button className="w-full bg-white border-2  text-black font-semibold py-4 px-6 rounded-xl  transition-all duration-300 transform hover:scale-105 shadow-md">
                    Ya tengo una cuenta
                  </button>
                </SignInButton>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Al registrarte, aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200 text-center">
              <div className="mb-6">
                <div className="scale-195">
                  <UserButton />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                ¡Bienvenido de vuelta!
              </h2>
              <p className="text-gray-600">
                Continúa tu viaje de transformación personal
              </p>
            </div>
          </SignedIn>
        </div>

        <div className="mt-12 text-center">
          <div className="  p-6 max-w-2xl mx-auto">
            
            <p className=" text-[40px] font-['Lato'] text-black font-light">
              Si necesita asistencia, escriba su email y mensaje:
            </p>
          </div>
        </div>
      </div>
      <ContactSection />
      <FooterSection />
    </div>
  );
}
