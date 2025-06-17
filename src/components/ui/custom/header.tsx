const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Mi Tienda Virtual</h1>
        </a>

        <nav>
          <ul className="flex space-x-4">
             <li>
              <a href="/otros" className="hover:underline">
                Otros
              </a>
            </li> 

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
