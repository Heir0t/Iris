const Logo = ({ className = "w-25 h-25" }: { className?: string }) => {
  return (
    <div className={`${className} `}>
      <img 
        src="assets/logo-iris.png" 
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
