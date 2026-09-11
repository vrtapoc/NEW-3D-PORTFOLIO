import React from 'react';
import "./Logo.scss";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";

const Logo = () => {

    const { isDarkRoom } = useToggleRoomStore();

    // 👉 White in dark room, Black in light room
    const iconColor = `icon-logo${!isDarkRoom ? " light" : ""}`;

    return (
        <div className="logo">
            <svg
                width="85"
                height="85"
                viewBox="0 0 75 75"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`icon ${iconColor}`}
            >
                {/* V */}
                <path
                    d="M12 23H19L27.5 47L36 23H43L31 53H24L12 23Z"
                    fill="white"
                />
                {/* T */}
                <path
                    d="M41 23H63V29H55V53H49V29H41V23Z"
                    fill="white"
                />
            </svg>
        </div>
    );
};

export default Logo;
