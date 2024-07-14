// "use client";
// import { useState } from 'react';
// import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// const languages = [
//   { id: 1, name: 'CPP', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Nv0XNyegzB0AvP-uFh4_A76FVuPg8t2g5g&s' },
//   { id: 2, name: 'Javascript', avatar: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/javascript-2752148-2284965.png?f=webp' },
// ];

// function classNames(...classes:any[]) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Example() {
//   const [selected, setSelected] = useState(languages[0]);
//   console.log(selected);
//   return (
//     <Listbox value={selected} onChange={setSelected}>
//       {({ open }) => (
//         <>
//           <Label className="block text-sm font-medium leading-6">Language</Label>
//           <div className="relative mt-2 w-48 ">
//             <ListboxButton className="relative w-full cursor-default rounded-md bg-slate-300 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
//               <span className="flex items-center">
//                 <img src={selected?.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
//                 <span className="ml-3 block truncate">{selected?.name}</span>
//               </span>
//               <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
//                 <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//               </span>
//             </ListboxButton>

//             <ListboxOptions
//               className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
//             >
//               {languages.map((language) => (
//                 <ListboxOption
//                   key={language.id}
//                   className={({ focus }) =>
//                     classNames(
//                       focus ? 'bg-indigo-600 text-white' : '',
//                       !focus ? 'text-gray-900' : '',
//                       'relative cursor-default select-none py-2 pl-3 pr-9',
//                     )
//                   }
//                   value={language}
                  
//                 >
//                   {({ selected, focus }) => (
//                     <>
//                       <div className="flex items-center">
//                         <img src={language.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
//                         <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
//                           {language.name}
//                         </span>
//                       </div>

//                       {selected ? (
//                         <span
//                           className={classNames(
//                             focus ? 'text-white' : 'text-indigo-600',
//                             'absolute inset-y-0 right-0 flex items-center pr-4',
//                           )}
//                         >
//                           <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                         </span>
//                       ) : null}
//                     </>
//                   )}
//                 </ListboxOption>
//               ))}
//             </ListboxOptions>
//           </div>
//         </>
//       )}
//     </Listbox>
//   );
// }
"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';



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
