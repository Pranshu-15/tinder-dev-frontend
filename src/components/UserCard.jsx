import React from 'react';

const UserCard = ({ user }) => {
  const { firstName, lastName, gender, photoURL, about, age, skills } = user;

  return (
    <div className="relative w-80 h-[560px] bg-base-100 rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ease-in-out">
      {/* Profile Image */}
      <img
        src={photoURL}
        alt={`${firstName} ${lastName}`}
        className="w-full h-[70%] object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/80 to-transparent"></div>

      {/* User Info */}
      <div className="absolute bottom-16 p-5 text-white">
        <h2 className="text-2xl font-semibold">
          {firstName} {lastName}, <span className="text-lg font-normal">{age}</span>
        </h2>
        <p className="text-sm opacity-80">{gender}</p>
        <p className="text-sm mt-1 opacity-90 line-clamp-2">{about}</p>
        {skills && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons (Like & Skip) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-around px-6">
        <button className="bg-red-500 hover:bg-red-600 text-white p-5 rounded-full shadow-lg transition-all active:scale-95">
          ❌
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-lg transition-all active:scale-95">
          💚
        </button>
      </div>
    </div>
  );
};

export default UserCard;


