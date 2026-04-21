const miLogoPng = '/assets/nintendo.png';

const IconSpinner = ({ size = 'w-16 h-16', className = '' }) => {
  return (
    // Contenedor centrado para que ocupe toda la pantalla
    <div className={`flex items-center justify-center w-full h-screen ${className}`}>
      {/* La imagen con la animación de Tailwind */}
      <img 
        src={miLogoPng} 
        alt="Cargando..." 
        className={`${size} animate-spin object-contain`}
        role="status"
      />
      {/* Texto oculto para accesibilidad */}
      <span className="sr-only">Cargando aplicación...</span>
    </div>
  );
};

export default IconSpinner;