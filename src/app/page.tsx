"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { 
  FaMoon, 
  FaSun, 
  FaStar, 
  FaRegStar, 
  FaCheck, 
  FaRocket, 
  FaTrophy, 
  FaMedal,
  FaCalendarAlt,
  FaUserFriends,
  FaComment,
  FaArchive,
  FaTrash,
  FaPlus,
  FaCog,
  FaFileExport,
  FaFileImport,
  FaChartLine,
  FaChartPie,
  FaSearch,
  FaFilter,
  FaLightbulb,
  FaRunning,
  FaBook,
  FaBriefcase,
  FaHeart,
  FaChevronRight,
  FaChevronLeft
} from "react-icons/fa";
import { 
  IoMdClose,
  IoMdSettings,
  IoMdNotifications
} from "react-icons/io";
import { 
  BsFillCloudSunFill,
  BsFillTreeFill,
  BsDropletFill,
  BsThreeDotsVertical
} from "react-icons/bs";
import { 
  RiPlantLine,
  RiSailboatLine
} from "react-icons/ri";

type Theme = "light" | "dark" | "night" | "ocean" | "forest";
type Priority = "low" | "medium" | "high";
type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  category?: string;
  tags?: string[];
  priority?: Priority;
  dueDate?: Date;
  dependsOn?: string[];
  progressHistory?: { date: Date; progress: number }[];
  sharedWith?: { userId: string; email: string; role: "viewer" | "editor" }[];
  isArchived?: boolean;
  comments: {
    name: string;
    text: string;
    avatar: string;
  }[];
};

const GoalTracker = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState<
    Omit<
      Goal,
       "comments" | "progressHistory" | "sharedWith" | "isArchived"
    >
  >({
    id: Date.now().toString(),
    title: "",
    description: "",
    progress: 0,
    category: "work",
    tags: [],
    priority: "medium",
    dueDate: undefined,
    dependsOn: [],
  });
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Launch Marketing Website",
      description:
        "Design and publish the new marketing site for product awareness.",
      progress: 100,
      category: "work",
      tags: ["marketing", "design"],
      priority: "high",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      progressHistory: [
        { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), progress: 30 },
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), progress: 60 },
      ],
      sharedWith: [
        { userId: "101", email: "alice@example.com", role: "editor" },
        { userId: "102", email: "bob@example.com", role: "viewer" },
      ],
      comments: [
        {
          name: "Alice",
          text: "This is progressing well. Nice work!",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          name: "Bob",
          text: "Can we update the hero image before launch?",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
      ],
    },
    {
      id: "2",
      title: "Develop Mobile App MVP",
      description: "Create the first version of our mobile app for testing.",
      progress: 100,
      category: "development",
      tags: ["mobile", "react-native"],
      priority: "medium",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      progressHistory: [
        { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), progress: 10 },
        { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), progress: 25 },
      ],
      comments: [
        {
          name: "Carol",
          text: "I love the login animation! Let's keep refining.",
          avatar: "https://randomuser.me/api/portraits/women/55.jpg",
        },
      ],
    },
    {
      id: "3",
      title: "Software development",
      description: "Create the first version of our Software.",
      progress: 60,
      category: "development",
      tags: ["mobile", "react-native"],
      priority: "medium",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      progressHistory: [
        { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), progress: 10 },
        { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), progress: 25 },
      ],
      comments: [
        {
          name: "Carol",
          text: "I love the login animation! Let's keep refining.",
          avatar: "https://randomuser.me/api/portraits/women/55.jpg",
        },
        {
          name: "Bob",
          text: "Can we update the hero image before launch?",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        }
      ],
    },
  ]);
  const [commentInputs, setCommentInputs] = useState<{
    [goalId: string]: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    progressMin: 0,
    progressMax: 100,
    priority: "",
  });
  const [showArchived, setShowArchived] = useState(false);

  // Theme management
  const toggleTheme = () => {
    setTheme((prev) => {
      switch (prev) {
        case "light":
          return "dark";
        case "dark":
          return "night";
        case "night":
          return "ocean";
        case "ocean":
          return "forest";
        case "forest":
          return "light";
        default:
          return "light";
      }
    });
  };

  const themeClasses = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      card: "bg-white",
      nav: "bg-white",
      button: "bg-indigo-600 hover:bg-indigo-700",
      progress: "bg-indigo-500",
      chartBg: "bg-white",
      icon: <FaSun className="inline" />
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-200",
      card: "bg-gray-800",
      nav: "bg-gray-800",
      button: "bg-indigo-500 hover:bg-indigo-600",
      progress: "bg-indigo-400",
      chartBg: "bg-gray-800",
      icon: <FaMoon className="inline" />
    },
    night: {
      bg: "bg-[#0e0c1b]",
      text: "text-gray-300",
      card: "bg-[#1a1730]",
      nav: "bg-[#1a1730]",
      button: "bg-purple-600 hover:bg-purple-700",
      progress: "bg-purple-500",
      chartBg: "bg-[#1a1730]",
      icon: <FaMoon className="inline" />
    },
    ocean: {
      bg: "bg-[#e0f7fa]",
      text: "text-[#006064]",
      card: "bg-white",
      nav: "bg-[#4dd0e1]",
      button: "bg-[#00acc1] hover:bg-[#00838f]",
      progress: "bg-[#00bcd4]",
      chartBg: "bg-white",
      icon: <BsDropletFill className="inline" />
    },
    forest: {
      bg: "bg-[#e8f5e9]",
      text: "text-[#2e7d32]",
      card: "bg-white",
      nav: "bg-[#81c784]",
      button: "bg-[#4caf50] hover:bg-[#388e3c]",
      progress: "bg-[#66bb6a]",
      chartBg: "bg-white",
      icon: <BsFillTreeFill className="inline" />
    },
  };

  // Goal statistics
  const completed = goals.filter((g) => g.progress === 100).length;
  const inProgress = goals.filter((g) => g.progress < 100).length;
  const chartData = [
    { name: "Completed", value: completed, fill: "#10B981" },
    { name: "In Progress", value: inProgress, fill: "#6366F1" },
  ];

  // Badges
  let badge = "";
  if (completed >= 5) badge = "🥇 Goal Crusher";
  else if (completed >= 3) badge = "🥈 Consistent Achiever";
  else if (completed >= 1) badge = "🥉 Getting Started";

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filters.category || goal.category === filters.category;
    const matchesProgress =
      goal.progress >= filters.progressMin &&
      goal.progress <= filters.progressMax;
    const matchesPriority =
      !filters.priority || goal.priority === filters.priority;
    const matchesArchive = showArchived || !goal.isArchived;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesProgress &&
      matchesPriority &&
      matchesArchive
    );
  });

  // Update progress with history tracking
  const updateProgress = (goalId: string, newProgress: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            progress: newProgress,
            progressHistory: [
              ...(goal.progressHistory || []),
              { date: new Date(), progress: newProgress },
            ],
          };
        }
        return goal;
      })
    );
  };

  // Export/import functions
  const exportGoals = () => {
    const dataStr = JSON.stringify(goals, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `goals-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importGoals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedGoals = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedGoals)) {
          if (
            confirm(
              `Import ${importedGoals.length} goals? This will replace your current goals.`
            )
          ) {
            setGoals(importedGoals);
          }
        }
      } catch (error) {
        alert("Failed to parse the file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  // Templates
  const templates = [
    {
      name: "Learn New Skill",
      description: "3-month learning plan with milestones",
      category: "learning",
      tags: ["education", "growth"],
      progress: 0,
      icon: <FaBook className="text-blue-500" />
    },
    {
      name: "Fitness Challenge",
      description: "12-week fitness program",
      category: "health",
      tags: ["exercise", "wellness"],
      progress: 0,
      icon: <FaRunning className="text-green-500" />
    },
    {
      name: "Work Project",
      description: "Complete major work initiative",
      category: "work",
      tags: ["professional", "career"],
      progress: 0,
      icon: <FaBriefcase className="text-indigo-500" />
    },
  ];

  return (
    <div
      className={`min-h-screen ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
    >
      {/* Navbar */}
      <nav
        className={`flex justify-between items-center p-6 shadow-md sticky top-0 z-50 ${themeClasses[theme].nav}`}
      >
        <div className="text-2xl font-bold text-indigo-600 flex items-center">
          <FaTrophy className="mr-2" /> GoalTrackr
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <button onClick={() => dashboardRef.current?.scrollIntoView({ behavior: "smooth" })} className="hover:text-indigo-600 transition cursor-pointer flex items-center">
            <FaChartPie className="mr-1" /> Dashboard
          </button>
          <button onClick={() => goalsRef.current?.scrollIntoView({ behavior: "smooth" })} className="hover:text-indigo-600 transition cursor-pointer flex items-center">
            <FaCheck className="mr-1" /> Goals
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="hover:text-indigo-600 transition cursor-pointer flex items-center"
          >
            <IoMdSettings className="mr-1" /> Settings
          </button>
          <button
            onClick={toggleTheme}
            className="text-sm px-3 py-1 cursor-pointer rounded border hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center"
          >
            {(() => {
              switch (theme) {
                case "light":
                  return <><FaMoon className="mr-1" /> Dark Mode</>;
                case "dark":
                  return <><FaMoon className="mr-1" /> Night Mode</>;
                case "night":
                  return <><BsDropletFill className="mr-1" /> Ocean Mode</>;
                case "ocean":
                  return <><BsFillTreeFill className="mr-1" /> Forest Mode</>;
                case "forest":
                  return <><FaSun className="mr-1" /> Light Mode</>;
                default:
                  return <><FaMoon className="mr-1" /> Dark Mode</>;
              }
            })()}
          </button>
        </div>
      </nav>

      {/* Landing Section */}
      <section ref={dashboardRef} className="flex flex-col items-center text-center py-20 px-4 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Set, Track, <span className="text-indigo-600">Achieve</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`text-lg md:text-xl max-w-2xl mb-8 ${
            theme === "dark" || theme === "night"
              ? "text-gray-400"
              : "text-gray-600"
          }`}
        >
          Build personal or team goals, visualize progress, celebrate
          milestones, and get feedback—all in one powerful dashboard.
        </motion.p>
        <button
          className={`${themeClasses[theme].button} text-white cursor-pointer font-semibold py-3 px-6 rounded-xl shadow-lg transition flex items-center`}
          onClick={() => goalsRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Get Started <FaChevronRight className="ml-2" />
        </button>
      </section>

      {/* Statistics Dashboard */}
      <section className="mt-10 p-6 bg-white rounded-lg shadow mx-5">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaChartLine className="mr-2" /> Goal Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium text-indigo-800 flex items-center">
              <FaCheck className="mr-2" /> Goals Completed
            </h3>
            <p className="text-3xl font-bold mt-2">{completed}</p>
            <p className="text-sm text-indigo-600">
              {goals.length > 0
                ? Math.round((completed / goals.length) * 100)
                : 0}
              % success rate
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 flex items-center">
              <FaChartLine className="mr-2" /> Avg. Progress
            </h3>
            <p className="text-3xl font-bold mt-2">
              {goals.length > 0
                ? Math.round(
                    goals.reduce((sum, goal) => sum + goal.progress, 0) /
                      goals.length
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-green-600">Across all active goals</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-800 flex items-center">
              <FaFilter className="mr-2" /> Goals by Category
            </h3>
            <div className="mt-2 space-y-1">
              {Object.entries(
                goals.reduce((acc, goal) => {
                  const cat = goal.category || "uncategorized";
                  acc[cat] = (acc[cat] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => (
                <div key={category} className="flex justify-between">
                  <span className="flex items-center">
                    {category === "work" && <FaBriefcase className="mr-1" />}
                    {category === "personal" && <FaHeart className="mr-1" />}
                    {category === "health" && <FaRunning className="mr-1" />}
                    {category === "learning" && <FaBook className="mr-1" />}
                    {category}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="mt-10 ml-5 w-[95%]">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaChartPie className="mr-2" /> Progress Overview
        </h2>
        <div
          className={`w-full h-64 shadow rounded-xl cursor-pointer flex items-center justify-center ${themeClasses[theme].chartBg}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="20%"
              outerRadius="90%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" background />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {badge && (
        <div
          className={`mt-4 border-l-4 p-4 rounded shadow ${
            theme === "dark"
              ? "bg-gray-800 border-indigo-400"
              : theme === "night"
              ? "bg-[#1a1730] border-purple-400"
              : "bg-indigo-50 border-indigo-400"
          }`}
        >
          <p
            className={`font-semibold text-lg flex items-center ${
              theme === "dark" || theme === "night"
                ? "text-indigo-300"
                : "text-indigo-700"
            }`}
          >
            <FaMedal className="mr-2" /> Milestone Unlocked: {badge}
          </p>
        </div>
      )}

      {/* Search and Filter */}
      <section className="mt-10 p-6 bg-white rounded-lg shadow mx-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaSearch className="mr-1" /> Search
            </label>
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaFilter className="mr-1" /> Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaChartLine className="mr-1" /> Progress Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={filters.progressMin}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    progressMin: parseInt(e.target.value),
                  })
                }
                className="w-16 p-2 border rounded"
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.progressMax}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    progressMax: parseInt(e.target.value),
                  })
                }
                className="w-16 p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaStar className="mr-1" /> Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={() => setShowArchived(!showArchived)}
            className="mr-2"
          />
          Show Archived Goals
        </label>
      </section>

      {/* Goals Section */}
      <section
        ref={goalsRef}
        className={`py-16 px-6 md:px-16 min-h-[300px] mt-3 ${
          theme === "dark"
            ? "bg-gray-800"
            : theme === "night"
            ? "bg-[#0e0c1b]"
            : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold flex items-center" ref={getStartedRef}>
            <FaCheck className="mr-2" /> Your Goals
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className={`${themeClasses[theme].button} text-white cursor-pointer px-4 py-2 rounded transition flex items-center`}
          >
            <FaPlus className="mr-2" /> Add Goal
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGoals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl shadow-lg p-6 flex flex-col gap-4 border ${
                themeClasses[theme].card
              } ${
                theme === "dark" || theme === "night"
                  ? "border-gray-700"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      theme === "ocean"
                        ? "text-[#00838f]"
                        : theme === "forest"
                        ? "text-[#2e7d32]"
                        : "text-indigo-600"
                    }`}
                  >
                    {goal.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" || theme === "night"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {goal.description}
                  </p>
                </div>
                {goal.progress >= 75 && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium flex items-center ${
                      theme === "dark"
                        ? "bg-green-900 text-green-200"
                        : theme === "night"
                        ? "bg-purple-900 text-purple-200"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    <FaRocket className="mr-1" /> Milestone!
                  </span>
                )}
              </div>

              {/* Goal metadata */}
              <div className="flex flex-wrap gap-2">
                {goal.category && (
                  <span
                    className={`text-xs px-2 py-1 rounded flex items-center ${
                      theme === "dark"
                        ? "bg-gray-700"
                        : theme === "night"
                        ? "bg-[#2a2545]"
                        : "bg-gray-100"
                    }`}
                  >
                    {goal.category === "work" && <FaBriefcase className="mr-1" />}
                    {goal.category === "personal" && <FaHeart className="mr-1" />}
                    {goal.category === "health" && <FaRunning className="mr-1" />}
                    {goal.category === "learning" && <FaBook className="mr-1" />}
                    {goal.category}
                  </span>
                )}
                {goal.priority && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      goal.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : goal.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {goal.priority === "high" && <FaStar className="mr-1" />}
                    {goal.priority === "medium" && <FaRegStar className="mr-1" />}
                    {goal.priority === "low" && <FaRegStar className="mr-1" />}
                    {goal.priority} priority
                  </span>
                )}
                {goal.dueDate && (
                  <span
                    className={`text-xs px-2 py-1 rounded flex items-center ${
                      new Date(goal.dueDate) < new Date() && goal.progress < 100
                        ? "bg-red-100 text-red-800"
                        : theme === "dark"
                        ? "bg-gray-700"
                        : theme === "night"
                        ? "bg-[#2a2545]"
                        : "bg-gray-100"
                    }`}
                  >
                    <FaCalendarAlt className="mr-1" />
                    {new Date(goal.dueDate).toLocaleDateString()}
                    {new Date(goal.dueDate) < new Date() &&
                      goal.progress < 100 &&
                      " (Overdue)"}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div
                  className={`w-full ${
                    theme === "dark" || theme === "night"
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  } h-3 rounded-full overflow-hidden`}
                >
                  <div
                    style={{ width: `${goal.progress}%` }}
                    className={`h-full ${themeClasses[theme].progress} transition-all duration-500 rounded-full`}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p
                    className={`text-sm ${
                      theme === "dark" || theme === "night"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {goal.progress}% complete
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateProgress(goal.id, Math.max(0, goal.progress - 10))
                      }
                      className="text-xs px-2 py-1 bg-gray-200 rounded flex items-center"
                    >
                      <FaChevronLeft className="mr-1" /> 10%
                    </button>
                    <button
                      onClick={() =>
                        updateProgress(
                          goal.id,
                          Math.min(100, goal.progress + 10)
                        )
                      }
                      className="text-xs px-2 py-1 bg-gray-200 rounded flex items-center"
                    >
                      +10% <FaChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {goal.tags && goal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {goal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === "dark"
                          ? "bg-gray-700"
                          : theme === "night"
                          ? "bg-[#2a2545]"
                          : "bg-gray-100"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Dependencies */}
              {goal.dependsOn && goal.dependsOn.length > 0 && (
                <div className="text-sm mt-2">
                  <span className="font-medium flex items-center">
                    <FaChevronRight className="mr-1" /> Depends on:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {goal.dependsOn.map((depId) => {
                      const depGoal = goals.find((g) => g.id === depId);
                      return depGoal ? (
                        <span
                          key={depId}
                          className={`text-xs px-2 py-1 rounded ${
                            theme === "dark"
                              ? "bg-gray-700"
                              : theme === "night"
                              ? "bg-[#2a2545]"
                              : "bg-gray-100"
                          }`}
                        >
                          {depGoal.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Progress History */}
              {goal.progressHistory && goal.progressHistory.length > 0 && (
                <div className="mt-4">
                  <p
                    className={`text-sm font-medium mb-2 flex items-center ${
                      theme === "dark" || theme === "night"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    <FaChartLine className="mr-2" /> Progress Timeline
                  </p>
                  <div className="space-y-2">
                    {goal.progressHistory
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 3)
                      .map((entry, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-8 text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div
                            className={`flex-1 ${
                              theme === "dark" || theme === "night"
                                ? "bg-gray-700"
                                : "bg-gray-200"
                            } rounded-full h-2`}
                          >
                            <div
                              className={`${
                                theme === "ocean"
                                  ? "bg-[#00acc1]"
                                  : theme === "forest"
                                  ? "bg-[#4caf50]"
                                  : "bg-green-500"
                              } h-2 rounded-full`}
                              style={{ width: `${entry.progress}%` }}
                            />
                          </div>
                          <div className="w-8 text-right text-xs">
                            {entry.progress}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Shared With */}
              {goal.sharedWith && goal.sharedWith.length > 0 && (
                <div className="mt-4">
                  <p
                    className={`text-sm font-medium mb-2 flex items-center ${
                      theme === "dark" || theme === "night"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    <FaUserFriends className="mr-2" /> Shared With
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {goal.sharedWith.map((user, i) => (
                      <div
                        key={i}
                        className={`flex items-center ${
                          theme === "dark"
                            ? "bg-gray-700"
                            : theme === "night"
                            ? "bg-[#2a2545]"
                            : "bg-gray-100"
                        } rounded-full px-3 py-1`}
                      >
                        <span className="text-sm">{user.email}</span>
                        <span className="text-xs ml-2 text-gray-500">
                          ({user.role})
                        </span>
                        <button
                          onClick={() => {
                            setGoals(
                              goals.map((g) =>
                                g.id === goal.id
                                  ? {
                                      ...g,
                                      sharedWith: g.sharedWith?.filter(
                                        (_, idx) => idx !== i
                                      ),
                                    }
                                  : g
                              )
                            );
                          }}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const email = prompt("Enter email to share with:");
                        if (email) {
                          setGoals(
                            goals.map((g) =>
                              g.id === goal.id
                                ? {
                                    ...g,
                                    sharedWith: [
                                      ...(g.sharedWith || []),
                                      {
                                        userId: Date.now().toString(),
                                        email,
                                        role: "viewer",
                                      },
                                    ],
                                  }
                                : g
                            )
                          );
                        }
                      }}
                      className="text-blue-500 text-sm flex items-center cursor-pointer"
                    >
                      <FaPlus className="mr-1" /> Add collaborator
                    </button>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mt-4">
                <p
                  className={`text-sm font-semibold mb-2 flex items-center ${
                    theme === "dark" || theme === "night"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  <FaComment className="mr-2" /> Feedback
                </p>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                  {goal.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <img
                        src={comment.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            theme === "dark" || theme === "night"
                              ? "text-gray-200"
                              : "text-gray-800"
                          }`}
                        >
                          {comment.name}
                        </p>
                        <p
                          className={`text-xs ${
                            theme === "dark" || theme === "night"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={commentInputs[goal.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [goal.id]: e.target.value,
                      })
                    }
                    placeholder="Add a comment..."
                    className={`w-full border ${
                      theme === "dark" || theme === "night"
                        ? "border-gray-700 bg-gray-700 text-white"
                        : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      theme === "ocean"
                        ? "focus:ring-[#00acc1]"
                        : theme === "forest"
                        ? "focus:ring-[#4caf50]"
                        : "focus:ring-indigo-500"
                    }`}
                  />
                  <button
                    onClick={() => {
                      const newComment = {
                        name: "You",
                        avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(
                          Math.random() * 10
                        )}.jpg`,
                        text: commentInputs[goal.id],
                      };

                      const updatedGoals = goals.map((g) =>
                        g.id === goal.id
                          ? { ...g, comments: [...g.comments, newComment] }
                          : g
                      );

                      setGoals(updatedGoals);
                      setCommentInputs({ ...commentInputs, [goal.id]: "" });
                    }}
                    className={`${themeClasses[theme].button} text-white cursor-pointer px-3 rounded text-sm flex items-center`}
                    disabled={!commentInputs[goal.id]?.trim()}
                  >
                    <FaComment className="mr-1" /> Post
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setGoals(
                      goals.map((g) =>
                        g.id === goal.id
                          ? { ...g, isArchived: !g.isArchived }
                          : g
                      )
                    );
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer flex items-center"
                >
                  <FaArchive className="mr-1" />
                  {goal.isArchived ? "Unarchive" : "Archive"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this goal?")) {
                      setGoals(goals.filter((g) => g.id !== goal.id));
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-700 cursor-pointer flex items-center"
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-sm w-[90%] max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-gray-800"
                : theme === "night"
                ? "bg-[#1a1730]"
                : "bg-white"
            }`}
          >
            <button
              className={`absolute top-2 cursor-pointer right-2 ${
                theme === "dark" || theme === "night"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setShowModal(false)}
            >
              <IoMdClose size={20} />
            </button>
            <h3
              className={`text-xl font-semibold mb-4 ${
                theme === "ocean"
                  ? "text-[#00838f]"
                  : theme === "forest"
                  ? "text-[#2e7d32]"
                  : "text-indigo-600"
              }`}
            >
              <FaPlus className="inline mr-2" /> Add New Goal
            </h3>

            {/* Template selector */}
            <div className="mb-4">
              <label className="block mb-2">Start from template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setNewGoal({
                        ...newGoal,
                        title: template.name,
                        description: template.description,
                        category: template.category,
                        tags: template.tags,
                        progress: template.progress,
                      })
                    }
                    className="border p-3 cursor-pointer rounded-lg text-left hover:bg-gray-50 transition flex flex-col"
                  >
                    <div className="flex items-center">
                      {template.icon}
                      <h4 className="font-medium ml-2">{template.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className={`border rounded px-3 py-2 text-sm ${
                  theme === "dark" || theme === "night"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : ""
                }`}
              />
              <textarea
                placeholder="Description"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                className={`border rounded px-3 py-2 text-sm ${
                  theme === "dark" || theme === "night"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : ""
                }`}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, category: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags (comma separated)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        setNewGoal({
                          ...newGoal,
                          tags: [...(newGoal.tags || []), value.replace(",", "")],
                        });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                  className="w-full p-2 border rounded"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newGoal.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center"
                    >
                      #{tag}
                      <button
                        onClick={() =>
                          setNewGoal({
                            ...newGoal,
                            tags: newGoal.tags?.filter(
                              (_, index) => index !== i
                            ),
                          })
                        }
                        className="ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 flex items-center">
                    <FaCalendarAlt className="mr-1" /> Due Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        dueDate: e.target.valueAsDate || undefined,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Progress %</label>
                  <input
                    type="number"
                    placeholder="Progress %"
                    value={newGoal.progress}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        progress: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded"
                    max={100}
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 flex items-center">
                  <FaChevronRight className="mr-1" /> Depends On
                </label>
                <select
                  multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (option) => option.value
                    );
                    setNewGoal({ ...newGoal, dependsOn: selected });
                  }}
                  className="w-full p-2 border rounded h-20"
                >
                  {goals
                    .filter((g) => g.id !== newGoal.id)
                    .map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title}
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!newGoal.title || !newGoal.description) return;
                  setGoals([
                    ...goals,
                    {
                      ...newGoal,
                      id: Date.now().toString(),
                      comments: [],
                      progressHistory: [
                        { date: new Date(), progress: newGoal.progress },
                      ],
                      sharedWith: [],
                      isArchived: false,
                    },
                  ]);
                  setShowModal(false);
                  setNewGoal({
                    id: Date.now().toString(),
                    title: "",
                    description: "",
                    progress: 0,
                    category: "work",
                    tags: [],
                    priority: "medium",
                    dueDate: undefined,
                    dependsOn: []
                  });
                }}
                className={`${themeClasses[theme].button} text-white py-2 cursor-pointer rounded transition mt-4 flex items-center justify-center`}
              >
                <FaPlus className="mr-2" /> Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`text-sm py-10 text-center border-t ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : theme === "night"
            ? "bg-[#0e0c1b] border-[#1a1730] text-gray-400"
            : "bg-gray-50 border-gray-200 text-gray-500"
        }`}
      >
        <p>© 2025 GoalTrackr. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a
            href="#"
            className={`hover:${
              theme === "ocean"
                ? "text-[#00838f]"
                : theme === "forest"
                ? "text-[#2e7d32]"
                : "text-indigo-600"
            }`}
          >
            About
          </a>
          <a
            href="#"
            className={`hover:${
              theme === "ocean"
                ? "text-[#00838f]"
                : theme === "forest"
                ? "text-[#2e7d32]"
                : "text-indigo-600"
            }`}
          >
            Privacy
          </a>
          <a
            href="#"
            className={`hover:${
              theme === "ocean"
                ? "text-[#00838f]"
                : theme === "forest"
                ? "text-[#2e7d32]"
                : "text-indigo-600"
            }`}
          >
            Contact
          </a>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-xl shadow-2xl max-w-md w-full ${
              theme === "dark"
                ? "bg-gray-800"
                : theme === "night"
                ? "bg-[#1a1730]"
                : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-4 flex items-center ${
                theme === "dark" || theme === "night"
                  ? "text-white"
                  : "text-gray-800"
              }`}
            >
              <IoMdSettings className="mr-2" /> Settings
            </h3>
            <p
              className={`mb-6 ${
                theme === "dark" || theme === "night"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Customize your GoalTrackr experience
            </p>

            <div className="space-y-4">
              <div>
                <label
                  className={`block mb-2 ${
                    theme === "dark" || theme === "night"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className={`w-full p-2 border rounded ${
                    theme === "dark" || theme === "night"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : ""
                  }`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="night">Night</option>
                  <option value="ocean">Ocean</option>
                  <option value="forest">Forest</option>
                </select>
              </div>

              <div>
                <label
                  className={`flex items-center ${
                    theme === "dark" || theme === "night"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={true}
                    onChange={() => {}}
                  />
                  <IoMdNotifications className="mr-2" /> Enable notifications
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={exportGoals}
                  className={`w-full p-2 flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-green-900 hover:bg-green-800"
                      : theme === "night"
                      ? "bg-purple-900 hover:bg-purple-800"
                      : "bg-green-100 hover:bg-green-200"
                  } text-green-800 rounded transition`}
                >
                  <FaFileExport className="mr-2" /> Export Goals
                </button>
                <div>
                  <label
                    className={`block p-2 flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-blue-900 hover:bg-blue-800"
                        : theme === "night"
                        ? "bg-purple-900 hover:bg-purple-800"
                        : "bg-blue-100 hover:bg-blue-200"
                    } text-blue-800 rounded transition cursor-pointer`}
                  >
                    <FaFileImport className="mr-2" /> Import Goals
                    <input
                      type="file"
                      accept=".json"
                      onChange={importGoals}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className={`mt-6 px-4 py-2 rounded transition ${themeClasses[theme].button} text-white w-full flex items-center justify-center`}
            >
              <FaCheck className="mr-2" /> Save Settings
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;