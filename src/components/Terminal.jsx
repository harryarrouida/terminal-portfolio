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
    FaComment, FaBriefcase,
    FaStar, FaFilm, FaKey, FaQuoteLeft, FaLaugh, FaCloud, FaNewspaper, FaHatWizard, FaMagic, FaSkull, FaSuperpowers, FaMask
} from 'react-icons/fa';
import { 
    BiErrorCircle, BiInfoCircle, BiRightArrow 
} from 'react-icons/bi';

import { fetchQuote, fetchJoke, fetchAnime, fetchFact, fetchWeather, searchMusic, fetchRandomCountry, fetchNews, fetchHPCharacter, fetchMarvelCharacter } from '../services/api';

const TerminalComponent = (props = {}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>
      Welcome to my terminal portfolio! Type 'help' to see available commands.
    </TerminalOutput>,
  ]);
  const [theme, setTheme] = useState('dark');
  const [startTime] = useState(new Date());
  const [currentGame, setCurrentGame] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHPGame, setCurrentHPGame] = useState(null);
  const [hpHintsUsed, setHPHintsUsed] = useState(0);
  const [currentMarvelGame, setCurrentMarvelGame] = useState(null);
  const [marvelHintsUsed, setMarvelHintsUsed] = useState(0);

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
      case "weather":
        if (args.length === 0) {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <BiErrorCircle />
                  <span>Usage: weather &lt;city&gt;</span>
                </div>
              }
              color={themeColors.error}
            />
          );
        } else {
          const city = args.join(' ');
          const weather = await fetchWeather(city);
          if (weather) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaCloud />
                      <span className="font-bold">{weather.city}, {weather.country}</span>
                    </div>
                    <div className="ml-6">
                      <div>Temperature: {weather.temperature}°C</div>
                      <div>Condition: {weather.description}</div>
                      <div>Humidity: {weather.humidity}%</div>
                      <div>Wind Speed: {weather.windSpeed} m/s</div>
                    </div>
                  </div>
                }
                color={themeColors.info}
              />
            );
          } else {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>City not found or weather service unavailable.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          }
        }
        break;
      case "country":
        if (args[0] === "skip") {
          if (!currentGame) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>No active game! Type 'country start' to begin.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else {
            const skippedCountry = currentGame.name;
            const newCountry = await fetchRandomCountry();
            if (newCountry) {
              setCurrentGame(newCountry);
              setHintsUsed(0);
              newOutput = (
                <TypedOutput
                  text={
                    <div className="flex flex-col gap-2">
                      <div>Skipped {skippedCountry}! Here's your new country:</div>
                      <img 
                        src={newCountry.flag} 
                        alt="Country Flag" 
                        className="h-48 w-72 object-contain my-2 rounded-lg shadow-lg" 
                      />
                      <div>Commands:</div>
                      <div className="ml-4">- 'country hint' for a hint</div>
                      <div className="ml-4">- 'country guess &lt;country name&gt;' to make a guess</div>
                      <div className="ml-4">- 'country skip' to skip this country</div>
                      <div>First hint: {newCountry.hints[0]}</div>
                    </div>
                  }
                  color={themeColors.primary}
                />
              );
            } else {
              newOutput = (
                <TypedOutput
                  text="Failed to fetch new country. Please try again."
                  color={themeColors.error}
                />
              );
            }
          }
        } else if (args[0] === "hint" && currentGame) {
          if (hintsUsed >= currentGame.hints.length + currentGame.name.length) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>No more hints available! The answer has been fully revealed!</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (hintsUsed >= currentGame.hints.length) {
            const revealedCount = hintsUsed - currentGame.hints.length;
            const revealed = currentGame.name.slice(0, revealedCount + 1);
            const masked = currentGame.name.slice(revealedCount + 1).replace(/./g, '_');
            setHintsUsed(hintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaLightbulb />
                    <span>Letter reveal: {revealed + masked}</span>
                  </div>
                }
                color={themeColors.warning}
              />
            );
          } else {
            setHintsUsed(hintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaLightbulb />
                    <span>Hint #{hintsUsed + 1}: {currentGame.hints[hintsUsed]}</span>
                  </div>
                }
                color={themeColors.info}
              />
            );
          }
        } else if (args[0] === "guess" && currentGame) {
          const guess = args.slice(1).join(' ').toLowerCase();
          if (!guess) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>Please provide a guess! Usage: country guess &lt;country name&gt;</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (guess === currentGame.name.toLowerCase()) {
            const score = Math.max(100 - (hintsUsed * 20), 20);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-400" />
                      <span>Congratulations! You guessed correctly!</span>
                    </div>
                    <div className="ml-6">
                      <img 
                        src={currentGame.flag} 
                        alt={`Flag of ${currentGame.name}`} 
                        className="h-48 w-72 object-contain my-2 rounded-lg shadow-lg" 
                      />
                      <div>Country: {currentGame.name}</div>
                      <div>Capital: {currentGame.capital}</div>
                      <div>Score: {score} points</div>
                    </div>
                    <div className="mt-2">Type 'country start' to play again!</div>
                  </div>
                }
                color={themeColors.success}
              />
            );
            setCurrentGame(null);
            setHintsUsed(0);
          } else {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>Wrong guess! Try again or type 'country hint' for a hint.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          }
        } else if (args[0] === "start") {
          const country = await fetchRandomCountry();
          if (country) {
            setCurrentGame(country);
            setHintsUsed(0);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div>🌍 Welcome to Guess the Country!</div>
                    <img 
                      src={country.flag} 
                      alt="Country Flag" 
                      className="h-48 w-72 object-contain my-2 rounded-lg shadow-lg" 
                    />
                    <div>I'm thinking of a country... Try to guess it!</div>
                    <div>Commands:</div>
                    <div className="ml-4">- 'country hint' for a hint</div>
                    <div className="ml-4">- 'country guess &lt;country name&gt;' to make a guess</div>
                    <div className="ml-4">- 'country skip' to skip this country</div>
                    <div className="mt-2">Type 'country hint' to get your first hint!</div>
                  </div>
                }
                color={themeColors.primary}
              />
            );
          } else {
            newOutput = (
              <TypedOutput
                text="Failed to start the game. Please try again."
                color={themeColors.error}
              />
            );
          }
        } else {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex flex-col gap-2">
                  <div>🌍 Guess the Country Game</div>
                  <div>Commands:</div>
                  <div className="ml-4">- 'country start' to start a new game</div>
                  <div className="ml-4">- 'country hint' for a hint</div>
                  <div className="ml-4">- 'country guess &lt;country name&gt;' to make a guess</div>
                  <div className="ml-4">- 'country skip' to skip current country</div>
                </div>
              }
              color={themeColors.info}
            />
          );
        }
        break;
      case "news":
        const validCategories = ['business', 'technology', 'sports', 'entertainment', 'science', 'health', 'general'];
        const category = args[0]?.toLowerCase() || 'general';
        
        if (!validCategories.includes(category)) {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex items-center gap-2">
                  <BiErrorCircle />
                  <span>
                    Invalid category. Available categories: {validCategories.join(', ')}
                  </span>
                </div>
              }
              color={themeColors.error}
            />
          );
        } else {
          const news = await fetchNews(category);
          if (news) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <FaNewspaper />
                      <span className="font-bold capitalize">Top {category} Headlines</span>
                    </div>
                    {news.map((article, index) => (
                      <div key={index} className="ml-6 flex flex-col gap-1">
                        <a 
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${themeColors.link} hover:underline font-medium`}
                        >
                          {article.title}
                        </a>
                        <div className={`${themeColors.muted} text-sm`}>
                          {article.description}
                        </div>
                        <div className="text-sm">
                          <span className={themeColors.accent}>{article.source}</span>
                          <span className={themeColors.muted}> • {article.publishedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                color={themeColors.primary}
              />
            );
          } else {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>Failed to fetch news. Please try again.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          }
        }
        break;
      case "hogwarts":
        if (args[0] === "skip") {
          if (!currentHPGame) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>No active game! Type 'hogwarts start' to begin.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else {
            const skippedCharacter = currentHPGame.name;
            const newCharacter = await fetchHPCharacter();
            if (newCharacter) {
              setCurrentHPGame(newCharacter);
              setHPHintsUsed(0);
              newOutput = (
                <TypedOutput
                  text={
                    <div className="flex flex-col gap-2">
                      <div>The character was {skippedCharacter}! Here's your new character:</div>
                      <img 
                        src={newCharacter.image} 
                        alt="Character" 
                        className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                      />
                      <div>Commands:</div>
                      <div className="ml-4">- 'hogwarts hint' for a hint</div>
                      <div className="ml-4">- 'hogwarts guess &lt;character name&gt;' to make a guess</div>
                      <div className="ml-4">- 'hogwarts skip' to skip this character</div>
                      <div>Type 'hogwarts hint' to get your first hint!</div>
                    </div>
                  }
                  color={themeColors.primary}
                />
              );
            } else {
              newOutput = (
                <TypedOutput
                  text="Failed to fetch new character. Please try again."
                  color={themeColors.error}
                />
              );
            }
          }
        } else if (args[0] === "hint" && currentHPGame) {
          if (hpHintsUsed >= currentHPGame.hints.length + currentHPGame.name.length) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaSkull />
                    <span>No more hints available! The answer has been fully revealed!</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (hpHintsUsed >= currentHPGame.hints.length) {
            const revealedCount = hpHintsUsed - currentHPGame.hints.length;
            const revealed = currentHPGame.name.slice(0, revealedCount + 1);
            const masked = currentHPGame.name.slice(revealedCount + 1).replace(/./g, '_');
            setHPHintsUsed(hpHintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaMagic />
                    <span>Letter reveal: {revealed + masked}</span>
                  </div>
                }
                color={themeColors.warning}
              />
            );
          } else {
            setHPHintsUsed(hpHintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaMagic />
                    <span>Hint #{hpHintsUsed + 1}: {currentHPGame.hints[hpHintsUsed]}</span>
                  </div>
                }
                color={themeColors.info}
              />
            );
          }
        } else if (args[0] === "guess" && currentHPGame) {
          const guess = args.slice(1).join(' ').toLowerCase();
          if (!guess) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>Please provide a guess! Usage: hogwarts guess &lt;character name&gt;</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (guess === currentHPGame.name.toLowerCase()) {
            const score = Math.max(100 - (hpHintsUsed * 12), 16);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaHatWizard className="text-yellow-400" />
                      <span>Brilliant! You've identified the character correctly!</span>
                    </div>
                    <div className="ml-6">
                      <img 
                        src={currentHPGame.image} 
                        alt={currentHPGame.name} 
                        className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                      />
                      <div className="font-bold text-lg">{currentHPGame.name}</div>
                      <div>House: {currentHPGame.details.house}</div>
                      <div>Patronus: {currentHPGame.details.patronus}</div>
                      <div>Wand: {currentHPGame.details.wand}</div>
                      <div>Ancestry: {currentHPGame.details.ancestry}</div>
                      <div className="mt-2">Score: {score} points</div>
                    </div>
                    <div className="mt-2">Type 'hogwarts start' to play again!</div>
                  </div>
                }
                color={themeColors.success}
              />
            );
            setCurrentHPGame(null);
            setHPHintsUsed(0);
          } else {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaSkull />
                    <span>Wrong guess! Try again or type 'hogwarts hint' for another hint.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          }
        } else if (args[0] === "start") {
          const character = await fetchHPCharacter();
          if (character) {
            setCurrentHPGame(character);
            setHPHintsUsed(0);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div>⚡ Welcome to the Hogwarts Character Challenge!</div>
                    <img 
                      src={character.image} 
                      alt="Character" 
                      className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                    />
                    <div>Can you identify this witch or wizard?</div>
                    <div>Commands:</div>
                    <div className="ml-4">- 'hogwarts hint' for a hint</div>
                    <div className="ml-4">- 'hogwarts guess &lt;character name&gt;' to make a guess</div>
                    <div className="ml-4">- 'hogwarts skip' to skip this character</div>
                    <div className="mt-2">Type 'hogwarts hint' to get your first hint!</div>
                  </div>
                }
                color={themeColors.primary}
              />
            );
          } else {
            newOutput = (
              <TypedOutput
                text="Failed to start the game. Please try again."
                color={themeColors.error}
              />
            );
          }
        } else {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex flex-col gap-2">
                  <div>⚡ Hogwarts Character Challenge</div>
                  <div>Commands:</div>
                  <div className="ml-4">- 'hogwarts start' to start a new game</div>
                  <div className="ml-4">- 'hogwarts hint' for a hint</div>
                  <div className="ml-4">- 'hogwarts guess &lt;character name&gt;' to make a guess</div>
                  <div className="ml-4">- 'hogwarts skip' to skip current character</div>
                </div>
              }
              color={themeColors.info}
            />
          );
        }
        break;
      case "marvel":
        if (args[0] === "skip") {
          if (!currentMarvelGame) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>No active game! Type 'marvel start' to begin.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else {
            const skippedCharacter = currentMarvelGame.name;
            const newCharacter = await fetchMarvelCharacter();
            if (newCharacter) {
              setCurrentMarvelGame(newCharacter);
              setMarvelHintsUsed(0);
              newOutput = (
                <TypedOutput
                  text={
                    <div className="flex flex-col gap-2">
                      <div>The character was {skippedCharacter}! Here's your new character:</div>
                      <img 
                        src={newCharacter.image} 
                        alt="Character" 
                        className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                      />
                      <div>Commands:</div>
                      <div className="ml-4">- 'marvel hint' for a hint</div>
                      <div className="ml-4">- 'marvel guess &lt;character name&gt;' to make a guess</div>
                      <div className="ml-4">- 'marvel skip' to skip this character</div>
                      <div>Type 'marvel hint' to get your first hint!</div>
                    </div>
                  }
                  color={themeColors.primary}
                />
              );
            } else {
              newOutput = (
                <TypedOutput
                  text="Failed to fetch new character. Please try again."
                  color={themeColors.error}
                />
              );
            }
          }
        } else if (args[0] === "hint" && currentMarvelGame) {
          if (marvelHintsUsed >= currentMarvelGame.hints.length + currentMarvelGame.name.length) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaSkull />
                    <span>No more hints available! The answer has been fully revealed!</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (marvelHintsUsed >= currentMarvelGame.hints.length) {
            const revealedCount = marvelHintsUsed - currentMarvelGame.hints.length;
            const revealed = currentMarvelGame.name.slice(0, revealedCount + 1);
            const masked = currentMarvelGame.name.slice(revealedCount + 1).replace(/./g, '_');
            setMarvelHintsUsed(marvelHintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaMask />
                    <span>Letter reveal: {revealed + masked}</span>
                  </div>
                }
                color={themeColors.warning}
              />
            );
          } else {
            setMarvelHintsUsed(marvelHintsUsed + 1);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaMask />
                    <span>Hint #{marvelHintsUsed + 1}: {currentMarvelGame.hints[marvelHintsUsed]}</span>
                  </div>
                }
                color={themeColors.info}
              />
            );
          }
        } else if (args[0] === "guess" && currentMarvelGame) {
          const guess = args.slice(1).join(' ').toLowerCase();
          if (!guess) {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <BiErrorCircle />
                    <span>Please provide a guess! Usage: marvel guess &lt;character name&gt;</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          } else if (guess === currentMarvelGame.name.toLowerCase()) {
            const score = Math.max(100 - (marvelHintsUsed * 15), 10);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FaSuperpowers className="text-yellow-400" />
                      <span>Excelsior! You've identified the character correctly!</span>
                    </div>
                    <div className="ml-6">
                      <img 
                        src={currentMarvelGame.image} 
                        alt={currentMarvelGame.name} 
                        className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                      />
                      <div className="font-bold text-lg">{currentMarvelGame.name}</div>
                      <div className="mt-2">{currentMarvelGame.details.description}</div>
                      <div className="mt-2">
                        <div>Comics: {currentMarvelGame.details.comics}</div>
                        <div>Series: {currentMarvelGame.details.series}</div>
                        <div>Stories: {currentMarvelGame.details.stories}</div>
                      </div>
                      {(currentMarvelGame.details.wiki || currentMarvelGame.details.comiclink) && (
                        <div className="mt-2 flex gap-4">
                          {currentMarvelGame.details.wiki && (
                            <a 
                              href={currentMarvelGame.details.wiki}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${themeColors.link} hover:underline flex items-center gap-1`}
                            >
                              <FaSuperpowers /> Wiki
                            </a>
                          )}
                          {currentMarvelGame.details.comiclink && (
                            <a 
                              href={currentMarvelGame.details.comiclink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${themeColors.link} hover:underline flex items-center gap-1`}
                            >
                              <FaMask /> Comics
                            </a>
                          )}
                        </div>
                      )}
                      <div className="mt-2">Score: {score} points</div>
                    </div>
                    <div className="mt-2">Type 'marvel start' to play again!</div>
                  </div>
                }
                color={themeColors.success}
              />
            );
            setCurrentMarvelGame(null);
            setMarvelHintsUsed(0);
          } else {
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex items-center gap-2">
                    <FaSkull />
                    <span>Wrong guess! Try again or type 'marvel hint' for another hint.</span>
                  </div>
                }
                color={themeColors.error}
              />
            );
          }
        } else if (args[0] === "start") {
          const character = await fetchMarvelCharacter();
          if (character) {
            setCurrentMarvelGame(character);
            setMarvelHintsUsed(0);
            newOutput = (
              <TypedOutput
                text={
                  <div className="flex flex-col gap-2">
                    <div>⚡ Welcome to the Marvel Character Challenge!</div>
                    <img 
                      src={character.image} 
                      alt="Character" 
                      className="h-48 w-40 object-cover my-2 rounded-lg shadow-lg" 
                    />
                    <div>Can you identify this Marvel character?</div>
                    <div>Commands:</div>
                    <div className="ml-4">- 'marvel hint' for a hint</div>
                    <div className="ml-4">- 'marvel guess &lt;character name&gt;' to make a guess</div>
                    <div className="ml-4">- 'marvel skip' to skip this character</div>
                    <div className="mt-2">Type 'marvel hint' to get your first hint!</div>
                  </div>
                }
                color={themeColors.primary}
              />
            );
          } else {
            newOutput = (
              <TypedOutput
                text="Failed to start the game. Please try again."
                color={themeColors.error}
              />
            );
          }
        } else {
          newOutput = (
            <TypedOutput
              text={
                <div className="flex flex-col gap-2">
                  <div>⚡ Marvel Character Challenge</div>
                  <div>Commands:</div>
                  <div className="ml-4">- 'marvel start' to start a new game</div>
                  <div className="ml-4">- 'marvel hint' for a hint</div>
                  <div className="ml-4">- 'marvel guess &lt;character name&gt;' to make a guess</div>
                  <div className="ml-4">- 'marvel skip' to skip current character</div>
                </div>
              }
              color={themeColors.info}
            />
          );
        }
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
