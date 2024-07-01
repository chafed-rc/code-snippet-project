import React from 'react';
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiC, 
  SiCplusplus, 
  SiCsharp,
  SiPhp, 
  SiRuby, 
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiScala,
  SiHaskell,
  SiLua,
  SiPerl,
  SiR,
  SiDart,
  SiElixir,
  SiClojure,
  SiErlang,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiSqlite,
  SiHtml5,
  SiCss3,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

function getLanguageIcon(language: string) {
  const iconProps = { className: "h-4 w-4" };
  
  switch (language.toLowerCase()) {
    case 'javascript':
      return <SiJavascript {...iconProps} color="#F7DF1E" />;
    case 'typescript':
      return <SiTypescript {...iconProps} color="#3178C6" />;
    case 'python':
      return <SiPython {...iconProps} color="#3776AB" />;
    case 'c':
      return <SiC {...iconProps} color="#A8B9CC" />;
    case 'c++':
      return <SiCplusplus {...iconProps} color="#00599C" />;
    case 'c#':
      return <SiCsharp {...iconProps} color="#239120" />;
    case 'php':
      return <SiPhp {...iconProps} color="#777BB4" />;
    case 'ruby':
      return <SiRuby {...iconProps} color="#CC342D" />;
    case 'go':
      return <SiGo {...iconProps} color="#00ADD8" />;
    case 'rust':
      return <SiRust {...iconProps} color="#000000" />;
    case 'swift':
      return <SiSwift {...iconProps} color="#FA7343" />;
    case 'kotlin':
      return <SiKotlin {...iconProps} color="#0095D5" />;
    case 'scala':
      return <SiScala {...iconProps} color="#DC322F" />;
    case 'haskell':
      return <SiHaskell {...iconProps} color="#5D4F85" />;
    case 'lua':
      return <SiLua {...iconProps} color="#2C2D72" />;
    case 'perl':
      return <SiPerl {...iconProps} color="#39457E" />;
    case 'r':
      return <SiR {...iconProps} color="#276DC3" />;
    case 'dart':
      return <SiDart {...iconProps} color="#0175C2" />;
    case 'elixir':
      return <SiElixir {...iconProps} color="#4B275F" />;
    case 'clojure':
      return <SiClojure {...iconProps} color="#5881D8" />;
    case 'erlang':
      return <SiErlang {...iconProps} color="#A90533" />;
    case 'sql':
      return <SiMysql {...iconProps} color="#4479A1" />;
    case 'postgresql':
      return <SiPostgresql {...iconProps} color="#336791" />;
    case 'mongodb':
      return <SiMongodb {...iconProps} color="#47A248" />;
    case 'sqlite':
      return <SiSqlite {...iconProps} color="#003B57" />;
    case 'html':
      return <SiHtml5 {...iconProps} color="#E34F26" />;
    case 'css':
      return <SiCss3 {...iconProps} color="#1572B6" />;
    case 'jsx':
    case 'tsx':
    case 'react':
      return <SiReact {...iconProps} color="#61DAFB" />;
    case 'vue':
      return <SiVuedotjs {...iconProps} color="#4FC08D" />;
    case 'angular':
      return <SiAngular {...iconProps} color="#DD0031" />;
    case 'svelte':
      return <SiSvelte {...iconProps} color="#FF3E00" />;
    default:
      return <VscCode {...iconProps} color="#007ACC" />; // Default icon for unknown languages
  }
}

export default getLanguageIcon;