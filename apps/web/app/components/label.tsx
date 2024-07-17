/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */

"use client"
import React, { useState } from 'react';



export default function LanguageLabel({setLanguageForMain}:{setLanguageForMain:(val:string)=>void}) {
  const languages = [
    {
      name: 'js',
      icon: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/javascript-2752148-2284965.png?f=webp',
    },
    {
      name: 'cpp',
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Nv0XNyegzB0AvP-uFh4_A76FVuPg8t2g5g&s',
    }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectLanguage = (language:any) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative w-48">
      <label className="block mb-2 text-sm font-medium ">Select a Language</label>
      <div className="relative">
        <div
          className="flex items-center justify-between cursor-pointer rounded border border-gray-300 bg-white p-2 shadow-sm"
          onClick={toggleDropdown}
        >
          <div className="flex items-center">
            <img src={selectedLanguage?.icon} alt={selectedLanguage?.name} className="h-5 w-5 rounded-full mr-2" />
            <span className='text-black'>{selectedLanguage?.name}</span>
          </div>
          <span className="ml-2 text-gray-500">▼</span>
        </div>
        {isOpen && (
          <div className="absolute mt-1 w-full rounded bg-white shadow-lg border border-gray-200 z-10">
            {languages.map((language, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => {
                  setLanguageForMain(language.name)
                  selectLanguage(language)
                }}
              >
                <img src={language.icon} alt={language.name} className="h-5 w-5 rounded-full mr-2" />
                <span className='text-black'>{language.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
