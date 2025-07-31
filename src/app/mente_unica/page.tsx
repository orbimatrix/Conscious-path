import React from 'react';
import Image from 'next/image';
import FooterSection from '../components/FooterSection';

export default function MenteUnicaPage() {
  return (
    <div className="min-h-screen">
      {/* Top Section - LA MENTE ÚNICA */}
      <section className="bg-[#A8926E] flex flex-col justify-center items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base md:text-lg uppercase tracking-wide text-gray-100">
            INFORMACIÓN
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-wider text-gray-100 leading-tight">
            LA MENTE ÚNICA
          </h1>
        </div>
      </section>

      {/* Bottom Section - CONOCIMIENTOS IMPRESCINDIBLES */}
      <section className="bg-white flex flex-col justify-center items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-[#A8926E] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl uppercase tracking-wide leading-tight">
            CONOCIMIENTOS IMPRESCINDIBLES
          </h2>
          <h3 className="text-[#A8926E] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase tracking-wide leading-tight">
            PARA DESPERTAR
          </h3>
        </div>
      </section>

      {/* Full Width Image Section */}
      <section className="w-full">
        <Image 
          src="/fotos/woman.jpg" 
          alt="Woman" 
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Text Content Section */}
      <section className="bg-white px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Paragraph */}
          <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              A continuación se exponen los puntos más importantes para poder avanzar por el camino espiritual. 
              Es un punto de partida esencial, pues evitará tomar caminos equivocados que nos harán perder 
              mucho tiempo. Recomendamos repasarlos cada cierto tiempo, hasta asumirlos.
            </p>
          </div>

          {/* Highlighted Box */}
          <div className="bg-[#B19B6D] p-4 sm:p-6 md:p-8 rounded-lg">
            <div className="text-gray-100 space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg md:text-xl uppercase font-bold">
                RECUERDE:
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                Todos somos estudiantes, y está en nuestra mano aprender las lecciones que nos devuelvan 
                a nuestro verdadero hogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbered Points Section */}
      <section className="bg-white px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">1. Todo lo que experimentamos es una idea dentro de la Mente Única, que todos compartimos.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">2. El elemento creador dentro de la Mente Única es el pensamiento. Por tanto su primera prioridad es vigilar y examinar los pensamientos.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">3. La ley fundamental en la Mente Única es la de Causa y Efecto. Todas las demás leyes y efectos derivan de esta ley fundamental, y nada puede existir que no responda a ésta.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">4. La ley de la Intención se deriva de la primera, y otorga sentido a todas las creaciones dentro de la Mente Única. De esta forma todo lo que existe en la ilusión mental nunca es casual.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">5. La Mente Única no puede dividirse, pero puede imaginar ser varios personajes en la ilusión. Por ese motivo somos uno con todos los demás habitantes de la ilusión, independientemente de las cuestiones que parezcan separarnos.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">6. Nuestro cuerpo percibido como material es solo una idea. Con él nos manifestamos en la experiencia dentro de la ilusión compartida, y se adapta a leyes ilusorias como el tiempo o la distancia.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">7. Toda percepción es errónea, pues no procede de nada real. Nuestros sentidos nos muestran una ilusión inexistente, una mera fantasía. Por eso cualquier juicio de una situación u otra persona está equivocado, pues lo único que juzgamos es un pensamiento propio que nos está siendo mostrado.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">8. El tiempo es una herramienta dentro de la ilusión que puede ser usada para alcanzar conciencia de nuestra verdadera naturaleza. También puede ser usado para dilatar hasta el infinito nuestro paso por la ilusión. Nuestra decisión de cómo usarlo determinará la experiencia que vivamos.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">9. Lo más valioso del mundo es la Atención, por su poder creativo, y por eso todo el mundo intenta captarla. Cada uno usa una estrategia diferente, pero el objetivo es conseguir captar su capacidad creadora para sus fines.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">11. Eres inmutable, pues lo eterno es perfecto y no necesita cambiar en su esencia. Eres completo, pues eres la mente única que todo lo crea. Al mismo tiempo experimenta la vida real y la vida ilusoria, y es preceptivo conocer sus diferencias.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">12. Eres indivisible, pues la mente única puede imaginar división más no dividirse a sí misma. Ser compasivo es su esencia, pues eres uno con todos. Es imposible que tengas dueño, aunque puedes jugar a poseer y ser poseído.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">15. Eres el creador y destructor de todo en la ilusión. Sin embargo no debe asociarse a la idea de &quot;Dios&quot;, pues no tiene el control sobre sí mismo. La idea de que es la única creación real de la Mente Única es más acertada.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">16. No necesita tener apego a nadie ni a nada. Vive eternamente en la luz, nunca en la oscuridad. Puede conservar para siempre lo bueno para sí, porque toda idea puede ser recordada.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">17. Dentro de la ilusión hemos creado niveles y planos de existencia, y en cada uno de ellos rigen leyes igual de ilusorias, pero reales para quienes lo experimentan.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">18. Se verá nacer y morir muchas veces. En realidad solo está experimentando la ilusión de la reencarnación inconsciente, porque así lo decidió. Decidir experimentar el renacer consciente es igual de accesible si así lo decide.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">19. El Karma es una idea generada dentro de la ilusión, y se experimenta en ciertos niveles. Le afectará hasta que supere el apego por las experiencias que cree que no han sido superadas.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="text-justify">20. La jerarquía real en la existencia es: Mente Única, Espíritu, Alma, Cuerpo. Lo superior afecta a lo inferior, lo inferior no afecta a lo superior.</p>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
