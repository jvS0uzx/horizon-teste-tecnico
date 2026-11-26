import logoHorizon from '../assets/horizon-logo.svg';

export function Cabecalho() {
  return (
    <header className="bg-preto">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <img
          src={logoHorizon}
          alt="Horizon Tecnologia"
          className="h-8 w-auto sm:h-9"
        />
      </div>
    </header>
  );
}
