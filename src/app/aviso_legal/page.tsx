import React from 'react';
import FooterSection from '../components/FooterSection';

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section - AVISO LEGAL */}
      <section className="bg-[#B19B6D] flex flex-col justify-center items-center py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base md:text-lg font-light uppercase tracking-wide text-gray-200">
            INFORMACIÓN
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-wider text-gray-100 leading-tight font-light" style={{fontWeight: 300, fontFamily: 'Lato, sans-serif'}}>
            AVISO LEGAL
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg border border-gray-200">
              <h3 className="text-lg sm:text-xl md:text-2xl  mb-6">
                AVISO LEGAL Y CONDICIONES GENERALES DE USO
              </h3>
              
              <div className="space-y-4 text-justify">
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className=" mb-3">Índice de contenidos:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Datos identificativos</li>
                    <li>USUARIOS y responsabilidades</li>
                    <li>Uso del servicio</li>
                    <li>Privacidad y Protección de Datos</li>
                    <li>Propiedad intelectual e industrial</li>
                    <li>Exclusión de garantías y responsabilidad</li>
                    <li>Modificaciones</li>
                    <li>Enlaces</li>
                    <li>Derecho de exclusión</li>
                    <li>Generalidades</li>
                    <li>Modificación de las presentes condiciones y duración</li>
                    <li>Legislación aplicable y jurisdicción</li>
                  </ol>
                </div>

                <h4 className="  mt-6">1. Datos identificativos</h4>
                <p>
                  La web www.SENDACONSCIENTE.com (en adelante denominada &quot;SENDACONSCIENTE&quot;) es un servicio online de orientación espiritual, gestionado por la compañía de responsabilidad limitada DigitalMaps OÜ con nº de registro 16551653 (en adelante DigitalMaps OÜ) con domicilio en Sepapaja tn 6, Lasnamäe linnaosa, Tallinn 15551, y con correo electrónico de contacto general &quot;info[arroba]SENDACONSCIENTE.com&quot;.
                </p>

                <h4 className=" mt-6">2. USUARIOS y responsabilidades</h4>
                <p>
                  El acceso y/o uso de este servicio, de forma parcial o completa, implica la condición de USUARIO, por lo que se asume el cumplimiento de las Condiciones Generales de Uso aquí reflejadas, en especial lo relativo a la Privacidad y Protección de Datos, así como cualquier otra norma legal que fuera de aplicación. Las citadas Condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
                </p>
                <p>
                  El USUARIO acepta que el contenido y funcionamiento de este servicio puede variar o cesar en cualquier momento y sin previo aviso, de forma parcial o total, por motivos propios o ajenos a sus administradores, y sin ser necesario ningún tipo de aviso previo a los USUARIOS.
                </p>
                <p>
                  El USUARIO acepta que el contenido de este servicio está dirigido al público adulto y puede contener material relativo a creencias que en ocasiones pueden herir la sensibilidad de las personas.
                </p>
                <p>
                  SENDACONSCIENTE es un servicio disponible a nivel mundial, pero su uso puede ser limitado por las autoridades de determinados territorios. DigitalMaps OÜ también puede limitar o bloquear su uso en determinados territorios. El USUARIO debe asegurarse que el servicio es de uso legal en su área de residencia, o en la que se encuentre de forma temporal, y que está legalmente capacitado para su uso.
                </p>

                <h4 className="  mt-6">3. Uso del servicio</h4>
                <p>
                  SENDACONSCIENTE proporciona el acceso a diversos contenidos en Internet pertenecientes a DigitalMaps OÜ a los que el USUARIO pueda tener acceso.
                </p>
                <p>
                  SENDACONSCIENTE asume la total responsabilidad sobre los contenidos publicados en la web, en cualquier forma. Será excepción si, mediante algún tipo de hackeo, terceros alteran el contenido de la web.
                </p>
                <p>
                  SENDACONSCIENTE exime a las personas que aparecen en sus vídeos y otros materiales de las repercusiones legales y económicas que pudieran derivarse.
                </p>
                <p>
                  SENDACONSCIENTE y su empresa matriz asumirán los gastos, costes, y perjuicios que puedan derivarse de la publicación de contenido por parte de los colaboradores invitados.
                </p>
                <p>
                  El USUARIO asume la total responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos. En dicho registro el USUARIO será responsable de aportar información veraz y lícita, así como elementos de contacto de los que sea el propietario legal al tiempo de su USUARIO legítimo, y mantener el pleno control de esos elementos de contacto. Como consecuencia de este registro, al USUARIO se le puede proporcionar una contraseña de la que será responsable, comprometiéndose a hacer un uso diligente y confidencial de la misma.
                </p>
                <p>
                  El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que DigitalMaps OÜ ofrece a través de su servicio SENDACONSCIENTE y con carácter enunciativo pero no limitativo, a no emplearlos para (i) incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público; (ii) difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos; (iii) provocar daños en los sistemas físicos y lógicos de DigitalMaps OÜ de sus proveedores o de terceras personas, introducir o difundir en la red virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar los daños anteriormente mencionados; (iv) intentar acceder y, en su caso, utilizar las cuentas de USUARIO de otros USUARIOS y modificarlas para manipular sus mensajes, acciones, propuestas, o cualquier otro tipo de acción.
                </p>

                <h5 className=" mt-4">3.1 Condiciones Generales de Contratación</h5>
                <p>
                  El registro de un USUARIO en SENDACONSCIENTE será gratuito, siendo requisitos indispensables i) tener 18 años cumplidos ii) ser mayor de edad en su territorio de residencia iii) que se realice de forma libre y por iniciativa propia iv) estar en posesión de plenas capacidades mentales, y poder certificarlo legalmente si se le requiere v) se realice personalmente y no a través de terceros y vi) que se realice a través de un dispositivo que sea propiedad del USUARIO y que conozca su funcionamiento.
                </p>
                <p>
                  El idioma de contratación de SENDACONSCIENTE es el Castellano, y se usará en todos los trámites legales y contractuales, si bien SENDACONSCIENTE puede facilitar traducciones de los textos de ciertos procesos en otros idiomas para mayor facilidad de uso.
                </p>
                <p>
                  Durante el proceso de registro SENDACONSCIENTE utiliza un sistema llamado doble Opt-In para validar el email del USUARIO, por lo que recibirá un email con un enlace al que deberá acceder para completar la validación. Dicha acción conlleva la aceptación total de las presentes condiciones.
                </p>
                <p>
                  DigitalMaps OÜ no será responsable de gastos en los que incurra el USUARIO mediante el uso de servicios no ofrecidos expresamente por DigitalMaps OÜ como por ejemplo los costes de las transferencias de datos, o las comisiones de los sistemas de pagos.
                </p>

                <h5 className=" mt-4">3.2 Cómo comprar y formas de pago</h5>
                <p>
                  Para acceder a las funciones avanzadas, el USUARIO podrá realizar compras en la plataforma.
                </p>

                <h5 className=" mt-4">3.3 Lista de precios</h5>
                <p>
                  Los precios pueden variar en cualquier momento sin previo aviso, al igual que pueden variar los impuestos de cualquiera de los estados. Es responsabilidad del USUARIO conocer la legislación que le pueda afectar, y reportar posibles errores de aplicación para su inmediata corrección. DigitalMaps OÜ se compromete en el esfuerzo de mantener actualizada toda la información legal que pueda ser de aplicación, incluida la relativa a impuestos.
                </p>

                <h6 className=" mt-3">3.3.1 Precio de las verificaciones</h6>
                <p>
                  Las verificaciones solicitadas por SENDACONSCIENTE serán gratuitas.
                </p>

                <h5 className=" mt-4">3.4 Uso de la cuenta del USUARIO</h5>
                <p>
                  La cuenta creada en SENDACONSCIENTE por un USUARIO es de carácter personal e intransferible, total o parcialmente, de forma permanente o temporal. Por ello queda totalmente prohibida la cesión de la cuenta a terceros en cualquier forma, incluyendo pero no limitándose a la venta de la cuenta, el alquiler de la cuenta, el préstamo de la cuenta, el sorteo de la cuenta, compartir la cuenta, o cualquier otro supuesto en el que una persona que no sea el creador de la cuenta pueda acceder y/o hacer uso de ella.
                </p>
                <p>
                  En el momento en que el USUARIO ya no desee hacer uso de su cuenta deberá darse de baja en la opción facilitada en la aplicación. Cuando en una cuenta no se registre actividad en un plazo de 1 año, se procederá a su baja. Cuando una cuenta registre repetidos reportes negativos de otros USUARIO podrá ser ser investigada, y se puede determinar que será dada de baja.
                </p>
                <p>
                  El USUARIO no podrá actuar en SENDACONSCIENTE causando una carga desmedida o inaceptable de las capacidades técnicas del servicio. El USUARIO no está autorizado a acceder a la web ni a sus bases de datos a través de otros programas que no sean navegadores convencionales. Esto se refiere especialmente a los llamados bots, scripts y otras herramientas que alteran la natural experiencia del USUARIO. El USUARIO no está autorizado a utilizar servidores privados y/o anónimos para su conexión con SENDACONSCIENTE.
                </p>
                <p>
                  El USUARIO no descargará ningún material desde la web. Todo el material está protegido con copyrigth.
                </p>

                <h6 className=" mt-3">3.4.1 Verificación de datos del USUARIO</h6>
                <p>
                  SENDACONSCIENTE podrá iniciar un proceso de verificación de los datos aportados por un USUARIO.
                </p>
                <p>
                  Se podrá iniciar este proceso a iniciativa de SENDACONSCIENTE para garantizar el cumplimiento de la ley y el respeto a los derechos de las personas. Si el USUARIO no accede a esta verificación podrá ser cancelada su cuenta.
                </p>

                <h5 className=" mt-4">3.5 Derecho de desistimiento</h5>
                <p>
                  El USUARIO dispone de un plazo de 14 días hábiles a partir de la fecha de su primera compra en SENDACONSCIENTE para ejercer su Derecho de desistimiento. Una vez finalizado el Derecho de desistimiento SENDACONSCIENTE no vendrá obligada a la devolución de ningún importe por cualquier concepto. En los supuestos en los que el USUARIO haya hecho uso del servicio antes de la comunicación fehaciente del desistimiento, SENDACONSCIENTE se reserva el derecho de realizar la devolución proporcional del importe del servicio. Para ejercitar el Derecho de desistimiento el USUARIO deberá notificar de forma expresa a SENDACONSCIENTE a través del email info[arroba]SENDACONSCIENTE.com su determinación de rescindir el contrato.
                </p>
                <p>
                  La forma de devoluciones económicas siempre se realizará en la misma forma de pago usada para adquirir nuestros servicios, y al mismo usuario.
                </p>
                <p>
                  En el caso de que un USUARIO inicie una disputa sobre nuestro servicio ante un servicio de pagos externo o legal, sin antes comunicarse con DigitalMaps OÜ y sin considerar nuestras propuestas de resolución de disputas, se considerará que el USUARIO renuncia a todos sus derechos en relación a nuestros servicios, por lo que podrá ser cancelada su cuenta, y perderá el derecho de devolución de los importes realizados.
                </p>

                <h4 className=" mt-6">4. Privacidad y Protección de Datos</h4>
                <p>
                  La política de Privacidad y Protección de Datos está ampliamente detallada en este enlace: Privacidad y Protección de Datos.
                </p>

                <h4 className=" mt-6">5. Propiedad intelectual e industrial</h4>
                <p>
                  DigitalMaps OÜ por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial del servicio SENDACONSCIENTE, así como de los elementos contenidos en el mismo (a título enunciativo, imágenes, sonido, audio, vídeo, software en cualquier formato y estado, o textos; marcas o logotipos, eslogan, imagotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.), titularidad de DigitalMaps OÜ o bien de sus licenciantes.
                </p>
                <p>
                  En virtud de lo dispuesto en las Leyes relativas a la Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de DigitalMaps OÜ
                </p>
                <p>
                  El USUARIO se compromete a respetar los derechos de Propiedad Intelectual e Industrial titularidad de DigitalMaps OÜ.
                </p>
                <p>
                  El USUARIO podrá visualizar los elementos de SENDACONSCIENTE según su nivel de acceso, pero no podrá imprimirlos, ni realizar capturas de pantalla, ni descargar ningún elemento del servicio. El USUARIO no podrá hacer copias de la información que se pueda presentar a través de la web, ni tratar los datos obtenidos de ninguna forma. El USUARIO deberá abstenerse de suprimir, alterar, eludir o manipular cualquier dispositivo de protección o sistema de seguridad que estuviera instalado en las páginas y aplicaciones de DigitalMaps OÜ
                </p>
                <p>
                  Para realizar cualquier tipo de consulta respecto a posibles incumplimientos de los derechos de propiedad intelectual o industrial, así como sobre cualquiera de los contenidos de SENDACONSCIENTE, puede hacerlo a través de la dirección de correo electrónico &quot;info[arroba]SENDACONSCIENTE.com&quot;.
                </p>

                <h5 className=" mt-4">5.1 Elementos para publicidad y difusión</h5>
                <p>
                  Puntualmente, y siempre con la aprobación previa de DigitalMaps OÜ un USUARIO que realice reportajes periodísticos, vídeos, o cualquier otro tipo de presentación sobre SENDACONSCIENTE podrá realizar capturas de pantalla de la aplicación. En todo caso será necesario que DigitalMaps OÜ revise dichas capturas antes de que el USUARIO proceda a la publicación, a fin de garantizar la intimidad de otros USUARIOS. El material capturado será destinado en exclusiva al uso acordado.
                </p>
                <p>
                  DigitalMaps OÜ quedará exenta de toda responsabilidad cuando un USUARIO realice capturas de pantalla o cualquier otro tipo de toma de datos sin permiso previo, explícito e inequívoco, siendo el USUARIO total responsable de las consecuencias legales que puedan derivarse de sus actos.
                </p>

                <h4 className=" mt-6">6. Exclusión de garantías y responsabilidad</h4>
                <p>
                  DigitalMaps OÜ no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                </p>
                <p>
                  DigitalMaps OÜ tampoco se hará responsable, en ningún caso, del uso indebido o poco prudente del servicio, asumiendo el USUARIO que se trata de un servicio de adultos y espiritual. Un uso poco prudente puede ocasionar por ejemplo: afectación de la imagen pública, pérdida de confianza por parte de terceros, o desventajas en procesos de separación matrimonial.
                </p>
                <p>
                  DigitalMaps OÜ no será responsable de los efectos en el USUARIO al acceder a información de tipo espiritual, tanto en su personalidad o comportamiento, sobre sí mismo o sobre terceros.
                </p>
                <p>
                  DigitalMaps OÜ no será responsable de las acciones que realice el USUARIO utilizando la información que el servicio puede aportarle.
                </p>
                <p>
                  DigitalMaps OÜ no se hace responsable de las consecuencias derivadas de comunicar a las autoridades información relativa al servicio, en el caso de que fuera requerido.
                </p>
                <p>
                  DigitalMaps OÜ no se hace responsable de la posible divulgación de datos por parte de terceros que realicen ataques informáticos para obtener información de nuestras bases de datos sin permiso. DigitalMaps OÜ garantiza aplica las máximas medidas de seguridad posibles, que cumple con la normativa de protección de datos de la forma más completa posible, y que evita recopilar cualquier tipo de información que no sea imprescindible para prestar el servicio.
                </p>
                <p>
                  DigitalMaps OÜ no se hace responsable de la falta de control total del USUARIO sobre la cuenta de correo electrónico que utilice para sus comunicaciones con nosotros, incluido el registro y las solicitudes de información sobre su cuenta. Tampoco nos hacemos responsables de la falta de control total de su número de teléfono, así como de los dispositivos desde los cuales se use tanto ese número como la aplicación. Algunos ejemplos en este sentido pueden ser: dejar la sesión de usuario de correo electrónico abierta, dejar el dispositivo desbloqueado al alcance de otras personas, no usar contraseñas suficientemente fuertes, no usar sistemas de doble identificación para acceder a sus servicios de comunicación, la navegación por sitios de internet que sean propicios para la realización de estafas o la instalación de virus informáticos, etc.
                </p>
                <p>
                  DigitalMaps OÜ no asume ninguna responsabilidad que pueda resultar de la utilización que los USUARIOS hacen de la información y contenidos de este servicio para justificar o apoyar cualquier juicio o decisión personal.
                </p>

                <h4 className=" mt-6">7. Modificaciones</h4>
                <p>
                  DigitalMaps OÜ se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en SENDACONSCIENTE, pudiendo cambiar, suprimir o añadir tanto los contenidos, precios, y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
                </p>

                <h4 className=" mt-6">8. Enlaces</h4>
                <p>
                  En el caso de que en SENDACONSCIENTE se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, DigitalMaps OÜ no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso DigitalMaps OÜ asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno de dichos enlaces u otros sitios de Internet. Igualmente la inclusión de estas conexiones externas no implicará ningún tipo de asociación, fusión o participación con las entidades conectadas.
                </p>

                <h5 className=" mt-4">8.1 Enlaces entrantes</h5>
                <p>
                  En caso de que terceras personas o empresas creasen enlaces hacia los servicios de SENDACONSCIENTE, observarán las siguientes condiciones:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>No será necesaria autorización previa si el enlace permite únicamente el acceso a la página de inicio. Cualquier otra forma de enlace requerirá la autorización expresa e inequívoca por escrito de DigitalMaps OÜ.</li>
                  <li>No se crearán &quot;marcos&quot; (&quot;frames&quot;) con las páginas Web, ni sobre las páginas Web propiedad de DigitalMaps OÜ.</li>
                  <li>No se realizarán manifestaciones o indicaciones falsas, inexactas, u ofensivas sobre DigitalMaps OÜ sus socios, sus empleados o colaboradores, sus productos, o de las personas que se relacionen en la web o la aplicación por cualquier motivo, o de los USUARIOS de SENDACONSCIENTE, o de los contenidos suministrados.</li>
                  <li>No se declarará ni se dará a entender que DigitalMaps OÜ ha autorizado el enlace o que ha supervisado o asumido de cualquier forma los contenidos ofrecidos o puestos a disposición de la página web en la que aparece el enlace.</li>
                  <li>La página Web en la que aparezca el enlace solo podrá contener lo estrictamente necesario para identificar el destino del enlace.</li>
                  <li>La página Web en la que se establezca el enlace no contendrá informaciones o contenidos ilícitos, contrarias a las leyes, así como tampoco contendrá contenidos contrarios a los derechos de terceros.</li>
                  <li>La página Web en la que se establezca el enlace no podrá producir efectos negativos de visibilidad en los buscadores de Internet, ni usar técnicas se SEO negativo.</li>
                </ol>

                <h5 className=" mt-4">8.2 Enlaces de referidos</h5>
                <p>
                  El USUARIO puede disponer de un enlace personal de referidos para ser compartido de persona a persona. Está permitido usarlo en webs o blog de su propiedad, incluyendo servicios de vídeo. Puede usarlo en las redes sociales, siendo responsabilidad del USUARIO observar todas las normas a cumplir. El USUARIO exime de total responsabilidad a DigitalMaps OÜ de todo daño o reclamación legal que pueda ser causada en el uso de su enlace personal para referidos.
                </p>

                <h4 className=" mt-6">9. Derecho de exclusión</h4>
                <p>
                  DigitalMaps OÜ se reserva el derecho a denegar o retirar el acceso a los servicios ofrecidos en SENDACONSCIENTE sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos USUARIOS que incumplan las presentes Condiciones Generales de Uso.
                </p>

                <h4 className=" mt-6">10. Generalidades</h4>
                <p>
                  DigitalMaps OÜ perseguirá el incumplimiento de las presentes condiciones así como cualquier utilización indebida de su servicio ejerciendo todas las acciones civiles y penales que le puedan corresponder en derecho. Además será especialmente vigilante en todo lo relativo a la protección del menor, de la libertad sexual, y libertad de credo, poniendo a disposición inmediata de las autoridades todo el material que pueda indicar un ataque a los derechos de estos u otros colectivos.
                </p>

                <h4 className=" mt-6">11. Modificación de las presentes condiciones y duración</h4>
                <p>
                  DigitalMaps OÜ se reserva el derecho a la modificación de las presentes Condiciones Generales de Uso y de Contratación. En caso de modificación, DigitalMaps OÜ informará a los USUARIOS registrados con anterioridad a la realización efectiva de los cambios. La condiciones se considerarán aceptadas si el usuario no muestra su oposición fehaciente en el plazo de 5 días desde el momento de la comunicación de los cambios. Si el usuario muestra su oposición a las modificaciones formalizadas, DigitalMaps OÜ tendrá derecho a rescindir la relación de uso del servicio SENDACONSCIENTE.
                </p>
                <p>
                  La vigencia las presentes Condiciones Generales de Uso y de Contratación irá en función de su exposición, y serán efectivas hasta que sean modificadas por otras debidamente publicadas.
                </p>

                <h4 className=" mt-6">12. Legislación aplicable y jurisdicción</h4>
                <p>
                  La relación entre DigitalMaps OÜ y el USUARIO se regirá por la normativa de Estonia vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Tallin, Estonia.
                </p>
                <p>
                  En el caso de la ineficacia de alguna disposición de las presentes condiciones de uso, el resto de las disposiciones seguirán en vigor. Se aplicará la normativa legal en lugar de la disposición ineficaz.
                </p>

                
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
