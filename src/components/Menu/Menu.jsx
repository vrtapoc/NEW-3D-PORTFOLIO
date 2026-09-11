import "./Menu.scss";
import { NavLink } from 'react-router';
import { useToggleRoomStore } from "../../stores/toggleRoomStore";

const Menu = () => {

  const { isDarkRoom } = useToggleRoomStore();

  const buttonClassNames = `nav-button${!isDarkRoom ? " light" : ""}`;

  return (
    <>
      <nav className = "menu">
        <div className="first-row">

          <NavLink to="/about">
          <svg width="47" height="47" viewBox="0 0 47 47" fill="none" 
          className={`about-button ${buttonClassNames}`}
          xmlns="http://www.w3.org/2000/svg">
          <rect width="47" height="47" rx="5" fill="white"/>
          <path d="M15.3333 34.8333C15.3333 30.0468 19.2135 26.1667 24 26.1667C28.7865 26.1667 32.6666 30.0468 32.6666 34.8333H15.3333ZM24 25.0833C20.4087 25.0833 17.5 22.1746 17.5 18.5833C17.5 14.9921 20.4087 12.0833 24 12.0833C27.5912 12.0833 30.5 14.9921 30.5 18.5833C30.5 22.1746 27.5912 25.0833 24 25.0833Z" 
          fill="black"/>
          </svg>       
          </NavLink>

          <NavLink to="/skills">
          <svg width="47" height="47" viewBox="0 0 47 47" fill="none"
          className={`skills-button ${buttonClassNames}`}
          xmlns="http://www.w3.org/2000/svg">
          <rect width="47" height="47" rx="5" fill="white"/>
          <path d="M22.9166 30.5H19.6027C19.2809 29.1214 17.8294 27.9928 17.2334 27.2491C16.0445 25.7655 15.3333 23.8825 15.3333 21.8333C15.3333 17.0469 19.2135 13.1667 24 13.1667C28.7865 13.1667 32.6666 17.0469 32.6666 21.8333C32.6666 23.8835 31.9547 25.7675 30.7646 27.2515C30.1689 27.9943 28.7188 29.1216 28.3972 30.5H25.0833V25.0833H22.9166V30.5ZM28.3333 32.6667V33.75C28.3333 34.9467 27.3633 35.9167 26.1666 35.9167H21.8333C20.6367 35.9167 19.6666 34.9467 19.6666 33.75V32.6667H28.3333Z" 
          fill="black"/>
          </svg>
          </NavLink> 

        </div>
          <div className="second-row">

          <NavLink to="/project-experience">
          <svg width="47" height="47" viewBox="0 0 47 47" fill="none" 
          className={`proj-button ${buttonClassNames}`}
          xmlns="http://www.w3.org/2000/svg">
          <rect width="47" height="47" rx="5" fill="white"/>
          <path d="M19.6667 15.3333C19.6667 13.5384 21.1217 12.0833 22.9167 12.0833C24.7116 12.0833 26.1667 13.5384 26.1667 15.3333C26.1667 15.7132 26.1014 16.0778 25.9817 16.4167H32.6667C33.265 16.4167 33.75 16.9017 33.75 17.5V20.8865C33.75 21.2214 33.5951 21.5375 33.3304 21.7427C33.0657 21.9479 32.7209 22.0191 32.3966 21.9357C32.1379 21.8691 31.8655 21.8333 31.5833 21.8333C29.7884 21.8333 28.3333 23.2884 28.3333 25.0833C28.3333 26.8783 29.7884 28.3333 31.5833 28.3333C31.8655 28.3333 32.1379 28.2976 32.3966 28.231C32.7209 28.1475 33.0657 28.2187 33.3304 28.4239C33.5951 28.6292 33.75 28.9452 33.75 29.2802V32.6667C33.75 33.265 33.265 33.75 32.6667 33.75H15.3333C14.735 33.75 14.25 33.265 14.25 32.6667V17.5C14.25 16.9017 14.735 16.4167 15.3333 16.4167H19.8516C19.7318 16.0778 19.6667 15.7132 19.6667 15.3333Z" 
          fill="black"/>
          </svg>
          </NavLink>

          <NavLink to="/contacts">
          <svg width="47" height="47" viewBox="0 0 47 47" fill="none" 
          className={`contacts-button ${buttonClassNames}`}
          xmlns="http://www.w3.org/2000/svg">
          <rect width="47" height="47" rx="5" fill="white"/>
          <path d="M13.4298 18.4255L23.447 12.4176C23.7901 12.2119 24.2187 12.2119 24.5617 12.4178L34.5704 18.4255C34.7336 18.5234 34.8334 18.6997 34.8334 18.8899V32.6667C34.8334 33.265 34.3483 33.75 33.75 33.75H14.25C13.6517 33.75 13.1667 33.265 13.1667 32.6667V18.8901C13.1667 18.6998 13.2665 18.5234 13.4298 18.4255ZM30.8744 19.9308L24.0657 25.8231L17.1178 19.9242L15.7155 21.5758L24.0792 28.6769L32.2923 21.5692L30.8744 19.9308Z" 
          fill="black"/>

          </svg>
          </NavLink>
          </div>
        </nav>
        <div className={`version-num ${!isDarkRoom ? "light" : ""}`}>
          <p>v1.0.0</p> 
        </div>
    </>
  );
};

export default Menu
