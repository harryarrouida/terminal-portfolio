import React, { useState, useEffect, useCallback, useMemo } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import commands from "../data/commands";
import projects from "../data/projects";
import skills from "../data/skills";
import SnakeGame from "./SnakeGame";

import {
    FaNodeJs, FaDatabase, FaGithub, 
    FaRocket, FaCode, FaTools, FaCoffee, FaLightbulb, FaClock,
    FaEnvelope, FaLinkedin, FaFileAlt, FaInstagram,
    FaComment, FaTwitter, FaInfo, FaBriefcase,
    FaStar, FaFilm, FaKey, FaQuoteLeft, FaLaugh
} from 'react-icons/fa';
import { 
    BiErrorCircle, BiInfoCircle, BiRightArrow 
} from 'react-icons/bi';

import { fetchQuote, fetchJoke, fetchAnime, fetchFact } from '../services/api';

const TerminalComponent = (props = {}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>
      Welcome to my terminal portfolio! Type 'help' to see available commands.
    </TerminalOutput>,
  ]);
  const [theme, setTheme] = useState('dark');
  const [startTime] = useState(new Date());

  // Helper function to get theme-appropriate colors
  const getThemeColor = useCallback((darkColor, lightColor) => {
    return theme === 'dark' ? darkColor : lightColor;
  }, [theme]);

  // Theme colors object using the helper
  const themeColors = useMemo(() => ({
    primary: getThemeColor('text-emerald-400', 'text-emerald-700'),
    secondary: getThemeColor('text-violet-400', 'text-violet-700'),
    accent: getThemeColor('text-amber-400', 'text-amber-700'),
    info: getThemeColor('text-sky-400', 'text-sky-700'),
    success: getThemeColor('text-green-400', 'text-green-700'),
    error: getThemeColor('text-rose-400', 'text-rose-700'),
    warning: getThemeColor('text-orange-400', 'text-orange-700'),
    muted: getThemeColor('text-gray-400', 'text-gray-600'),
    link: getThemeColor('text-cyan-400', 'text-cyan-700'),
  }), [getThemeColor]);

  const TypedOutput = ({ text, color = themeColors.primary, isLink = false }) => (
    <TerminalOutput>
      <span 
        className={`
          ${color} typed-text 
          ${isLink ? 'cursor-pointer hover:underline hover:opacity-80' : ''} 
          transition-all duration-200 block w-full whitespace-pre-wrap break-words
        `}
        style={{
          animation: typeof text === 'string' ? `typing ${text.length * 20}ms steps(${text.length})` : 'none'
        }}
        onClick={isLink ? () => window.open(text.props.children[text.props.children.length - 1], '_blank') : undefined}
        title={isLink ? 'Ctrl + Click to open link' : ''}
      >
        {text}
      </span>
    </TerminalOutput>
  );

  const handleCommand = async (input) => {
    const [command, ...args] = input.toLowerCase().trim().split(' ');
    let newOutput;

    switch (command) {
      case "clear":
        setTerminalLineData([]);
        return;
      case "help":
        newOutput = Object.entries(commands).map(([cmd, desc]) => (
          <TypedOutput
            text={
              <div className="flex gap-2 min-h-[1.5rem] items-start">
                <BiInfoCircle className="text-lg mt-0.5" />
                <div className="flex-1">
                  <span className="font-medium">{cmd}:</span>
                  <span className={`${themeColors.muted} ml-2`}>{desc}</span>
                </div>
              </div>
            }
            color={themeColors.info}
          />
        ));
        break;
      case "about":
        newOutput = (
          <TypedOutput
            text="I'm a full-stack developer passionate about building great web applications."
            color={themeColors.primary}
          />
        );
        break;
      case "projects":
        newOutput = projects.map((project) => (
          <TypedOutput
            text={
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 min-h-[1.5rem] items-start">
                  <FaCode className="text-lg mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">{project.name}</span>
                    <div className={`${themeColors.muted} mt-1`}>
                      {project.description}
                    </div>
                    <div className="flex gap-4 mt-2">
                      {project.github ? (
                        <a href={project.github} className={`${themeColors.link} flex items-center gap-2 hover:opacity-80`}>
                          <FaGithub /> GitHub
                        </a>
                      ) : (
                        <span className={`${themeColors.muted} flex items-center gap-2`}>
                          <FaGithub /> Coming Soon
                        </span>
                      )}
                      {project.demo ? (
                        <a href={project.demo} className={`${themeColors.success} flex items-center gap-2 hover:opacity-80`}>
                          <FaRocket /> Demo
                        </a>
                      ) : (
                        <span className={`${themeColors.muted} flex items-center gap-2`}>
                          <FaRocket /> Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            }
            color={themeColors.primary}
          />
        ));
        break;
      case "skills":
        newOutput = Object.entries(skills).map(([category, skillList]) => (
          <TypedOutput
            text={
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 min-h-[1.5rem] items-start">
                  {category === 'frontend' && <FaCode className="text-lg mt-0.5" />}
                  {category === 'backend' && <FaNodeJs className="text-lg mt-0.5" />}
                  {category === 'databases' && <FaDatabase className="text-lg mt-0.5" />}
                  {category === 'tools' && <FaTools className="text-lg mt-0.5" />}
                  <span className="font-bold">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 ml-6">
                  {skillList.map(skill => (
                    <div className="flex gap-2 min-h-[1.5rem] items-center">
                      <BiRightArrow className="text-sm flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
            color={themeColors.secondary}
          />
        ));
        break;
      case "snake":
        newOutput = (
          <TerminalOutput>
            <TypedOutput
              text="Starting Snake Game... Use arrow keys to control the snake!"
              color={themeColors.success}
            />
            <div className="mt-4">
              <SnakeGame
                onGameOver={(score) => {
                  setTerminalLineData((prev) => [
                    ...prev,
                    <TypedOutput
                      text={`Game Over! Final Score: ${score}. Type 'snake' to play again!`}
                      color={themeColors.warning}
                    />,
                  ]);
                }}
              />
            </div>
          </TerminalOutput>
        );
        break;
        const projectName = args.join(' ');
        const project = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
        if (project) {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex flex-col gap-2">
                  <div><FaCode className="inline mr-2" />{project.name}</div>
                  <div className="ml-4">{project.description}</div>
                  <div className="ml-4"><FaGithub className="inline mr-2" />GitHub: {project.github}</div>
                  <div className="ml-4"><FaRocket className="inline mr-2" />Demo: {project.demo}</div>
                </div>
              }
              color={themeColors.primary}
            />
          );
        } else {
          newOutput = <TypedOutput text="Project not found. Use 'projects' to see available projects." color={themeColors.error} />;
        }
        break;
      case "resume":
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaFileAlt />
                <span>Download my resume: </span>
                <a
                  href="https://drive.google.com/file/d/1Qe5-pRYPQnA9dy6wGpWo9KDws553mDzS/view?usp=drive_link"
                  className="text-blue-400 hover:underline"
                >
                  resume.pdf
                </a>
              </div>
            }
            color={themeColors.success}
          />
        );
        break;
      case "contact":
        newOutput = (
          <>
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  <span>Email: hamzaarrouida@gmail.com</span>
                </div>
              }
              color={themeColors.link}
            />
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <FaLinkedin />
                  <span>
                    LinkedIn:{" "}
                    <a href="https://www.linkedin.com/in/hamza-arrouida-b2a37a2a9/">hamza-arrouida</a>
                  </span>
                </div>
              }
              color={themeColors.link}
            />
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <FaGithub />
                  <span>
                    GitHub:{" "}
                    <a href="https://github.com/harryarrouida">@harryarrouida</a>
                  </span>
                </div>
              }
              color={themeColors.link}
            />
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <FaInstagram />
                  <span>
                    Instagram:{" "}
                    <a href="https://instagram.com/nnvncbl">@nnvncbl</a>
                  </span>
                </div>
              }
              color={themeColors.link}
            />
          </>
        );
        break;
      case "theme":
        setTheme(theme === 'dark' ? 'light' : 'dark');
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaLightbulb />
                <span>Theme switched to {theme === 'dark' ? 'light' : 'dark'} mode</span>
              </div>
            }
            color={themeColors.accent}
          />
        );
        break;
      case "quote":
        const quote = await fetchQuote();
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaQuoteLeft className="text-sm" />
                <span>{quote}</span>
              </div>
            }
            color={themeColors.secondary}
          />
        );
        break;
      case "joke":
        const joke = await fetchJoke();
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaLaugh />
                <span>{joke}</span>
              </div>
            }
            color={themeColors.success}
          />
        );
        break;
      case "anime":
        const anime = await fetchAnime();
        if (anime) {
          newOutput = (
            <>
              <TypedOutput
                text={
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2">
                      <FaFilm />
                      <span className="font-bold">{anime.title}</span>
                    </div>
                    <div className="mt-2 ml-6">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        <span>Rating: {anime.rating}/10</span>
                      </div>
                      <div className="mt-2">{anime.synopsis}</div>
                    </div>
                  </div>
                }
                color={themeColors.primary}
              />
            </>
          );
        } else {
          newOutput = <TypedOutput text="Failed to fetch anime info. Please try again." color={themeColors.error} />;
        }
        break;
      case "secret":
        const fact = await fetchFact();
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaKey />
                <span>{fact}</span>
              </div>
            }
            color={themeColors.success}
          />
        );
        break;
      case "uptime":
        const uptime = Math.floor((new Date() - startTime) / 1000);
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaClock />
                <span>Terminal has been running for {uptime} seconds</span>
              </div>
            }
            color={themeColors.info}
          />
        );
        break;
      case "echo":
        if (args.length === 0) {
          newOutput = (
            <TypedOutput
              text="Usage: echo <text>"
              color={themeColors.error}
            />
          );
        } else {
          newOutput = (
            <TypedOutput
              text={args.join(' ')}
              color={getThemeColor('text-white', 'text-gray-900')}
            />
          );
        }
        break;
      case "hireme":
        newOutput = (
          <TypedOutput
            text={
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FaBriefcase />
                  <span className="font-bold">Why You Should Hire Me:</span>
                </div>
                <div className="ml-6">
                  • Passionate about clean, efficient code
                  • Strong problem-solving skills
                  • Great team player
                  • Always eager to learn
                  • Experience with modern tech stack
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <FaFileAlt />
                  <a href="/path-to-your-cv.pdf" className="text-blue-400 hover:underline">
                    Download my CV
                  </a>
                </div>
              </div>
            }
            color={themeColors.success}
          />
        );
        break;
        newOutput = (
          <TypedOutput
            text={
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FaInfo />
                  <span>This terminal portfolio showcases my work and skills in an interactive way.</span>
                </div>
                <div className="ml-6">
                  Built with React, Tailwind CSS, and a passion for unique user experiences.
                </div>
              </div>
            }
            color={themeColors.primary}
          />
        );
        break;
      case "feedback":
        newOutput = (
          <TypedOutput
            text={
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FaComment />
                  <span>I'd love to hear your thoughts! You can reach me at:</span>
                </div>
                <div className="ml-6 flex flex-col gap-1">
                  <a href="mailto:hamzaarrouida@gmail.com" className="text-blue-400 hover:underline">
                    <FaEnvelope className="inline mr-2" />
                    hamzaarrouida@gmail.com
                  </a>
                  <a href="https://instagram.com/nnvncbl" className="text-blue-400 hover:underline">
                    <FaInstagram className="inline mr-2" />
                    @nnvncbl
                  </a>
                </div>
              </div>
            }
            color={themeColors.secondary}
          />
        );
        break;
      case "tea":
        const teaFact = await fetchFact();
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <FaCoffee />
                <span>{teaFact}</span>
              </div>
            }
            color={themeColors.success}
          />
        );
        break;
      default:
        newOutput = (
          <TypedOutput
            text={
              <div className="flex items-center gap-2">
                <BiErrorCircle />
                <span>Command not found. Type 'help' for available commands.</span>
              </div>
            }
            color={themeColors.error}
          />
        );
    }

    setTerminalLineData([
      ...terminalLineData,
      <TerminalOutput>
        <span className={`${themeColors.muted} font-bold`}>$ </span>
        <span className={getThemeColor('text-white', 'text-gray-900')}>{input}</span>
      </TerminalOutput>,
      newOutput,
    ]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        document.body.classList.add("ctrl-pressed");
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        document.body.classList.remove("ctrl-pressed");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={`h-screen w-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-8`}>
      <div className="max-w-4xl mx-auto [&_*]:scrollbar-thin [&_*]:scrollbar-track-gray-800 [&_*]:scrollbar-thumb-gray-600 [&_*]:hover:[&_*]:scrollbar-thumb-gray-500">
        <Terminal
          name="Terminal Portfolio"
          colorMode={theme === 'dark' ? ColorMode.Dark : ColorMode.Light}
          onInput={handleCommand}
          prompt=">"
          height="500px"
          className="terminal-container"
        >
          {terminalLineData}
        </Terminal>
      </div>
    </div>
  );
};

export default TerminalComponent;
