import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Button } from "./button";
import { Mail, Github, Phone, Award, BookOpen, Briefcase, Code, FileText, Star, ExternalLink, User, Calendar, MapPin } from "lucide-react";

export function Profile() {
  const { theme } = useTheme();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Bio */}
      <div className="lg:col-span-1 space-y-6">
        <ProfileCard />
        <Research />
      </div>
      
      {/* Right Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        <Education />
        <Experience />
        <Publications />
        <Awards />
      </div>
    </div>
  );
}

function ProfileCard() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-40">
        <Image
          src="/avatars/background.jpg"
          alt="Profile Background"
          fill
          className="object-cover"
        />
        <div 
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden"
          style={{width: "8rem", height: "8rem"}}
        >
          <Image
            src="/avatars/myself.jpeg" 
            alt="Bo Shen"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
      </div>
      
      <div className="pt-20 pb-8 px-6 text-center">
        <h1 className="text-2xl font-bold">Bo Shen</h1>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1`}>
          Researcher&Developer at Huawei Cloud Computing
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Mail size={18} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <a href="mailto:shenbo@pku.edu.cn" className="text-blue-500 hover:underline">shenbo@pku.edu.cn</a>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Phone size={18} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              (+86) 155-012-59088
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Github size={18} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <a 
              href="https://www.github.com/Symbolk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              github.com/Symbolk
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface SectionTitleProps {
  title: string;
  icon: React.ElementType;
}

function SectionTitle({ title, icon }: SectionTitleProps) {
  const { theme } = useTheme();
  const Icon = icon;
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"}`}>
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function Education() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <SectionTitle title="Education" icon={BookOpen} />
      
      <div className="space-y-4">
        <TimelineItem
          title="Ph.D. in Computer Science"
          institution="Peking University"
          location="Beijing, China"
          period="Sep 2016 - Jan 2022"
          description="School of Electronics Engineering and Computer Science"
        />
        
        <TimelineItem
          title="B.Eng. in Software Engineering"
          institution="Northwestern Polytechnical University"
          location="Xi'an, China" 
          period="Sep 2012 - Jul 2016"
          description="School of Software and Microelectronics"
        />
      </div>
    </motion.div>
  );
}

function Experience() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SectionTitle title="Experience" icon={Briefcase} />
      
      <div className="space-y-4">
        <TimelineItem
          title="Researcher&Developer"
          institution="Huawei Cloud Computing"
          location="Beijing, China"
          period="Jan 2022 - Present"
          description="PaaS - Technology Innovation Lab"
        />
      </div>
    </motion.div>
  );
}

function Research() {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <SectionTitle title="Research Interests" icon={Code} />
      
      <ul className="space-y-2 list-disc list-inside ml-2">
        <li>Agentic Model Reinforcement Learning</li>
        <li>AI Coding Assistant Powered by LLMs</li>
        <li>Multi-Automous-Agent Systems</li>
        <li>AI & Human Collective Intelligence</li>
      </ul>
    </motion.div>
  );
}

interface Paper {
  title: string;
  authors: string;
  venue: string;
  year: string;
  highlight?: string;
  link?: string;
}

function Publications() {
  const { theme } = useTheme();
  const [showAllPublications, setShowAllPublications] = useState(false);
  
  const papers: Paper[] = [
    {
      title: "PanGu-Coder2: Boosting Large Language Models for Code with Ranking Feedback",
      authors: "Bo Shen, Jiaxin Zhang, Taihong Chen, Daoguang Zan, Bing Geng, An Fu, Muhan Zeng, Ailun Yu, Jichuan Ji, Jingyang Zhao, Yuenan Guo, Qianxiang Wang",
      venue: "ArXiv",
      year: "2023",
      link: "#"
    },
    {
      title: "CodeM: Less Data Yields More Versatility via Ability Matrix (Findings)",
      authors: "Daoguang Zan, Ailun Yu, Wei Liu, Bo Shen, Shaoxin Lin, Yongshun Gong, Yafen Yao, Yan Liu, Bei Guan, Weihua Luo, Yongji Wang, Qianxiang Wang, Lizhen Cui",
      venue: "ACL",
      year: "2024",
      link: "#"
    },
    {
      title: "GraphCoder: Enhancing Repository-Level Code Completion via Code Context Graph-based Retrieval and Language Model",
      authors: "Wei Liu, Ailun Yu, Daoguang Zan, Bo Shen, Wei Zhang, Haiyan Zhao, Zhi Jin, Qianxiang Wang",
      venue: "ASE",
      year: "2024",
      link: "#"
    },
    {
      title: "CoderEval: A Benchmark of Pragmatic Code Generation with Generative Pre-trained Models",
      authors: "Hao Yu, Bo Shen, Dezhi Ran, Jiaxin Zhang, Qi Zhang, Yuchi Ma, Guangtai Liang, Ying Li, Qianxiang Wang, and Tao Xie",
      venue: "ICSE",
      year: "2024",
      link: "#"
    },
    {
      title: "SmartCommit: A Graph-Based Interactive Assistant for Activity-Oriented Commits",
      authors: "Bo Shen, Wei Zhang, Christian Kästner, Haiyan Zhao, Zhao Wei, Guangtai Liang, and Zhi Jin",
      venue: "FSE",
      year: "2021",
      highlight: "ACM SIGSOFT Distinguished Paper Award",
      link: "#"
    }
  ];
  
  // Additional papers that will show when "View All" is clicked
  const additionalPapers: Paper[] = [
    {
      title: "DiffCoder: Enhancing Large Language Model on API Invocation via Analogical Code Exercises",
      authors: "Daoguang Zan, Ailun Yu, Bo Shen, Bei Chen, Wei Li, Yongshun Gong, Xiaolin Chen, Yafen Yao, Weihua Luo, Bei Guan, Yan Liu, Yongji Wang, Qianxiang Wang, and Lizhen Cui",
      venue: "FSE",
      year: "2024",
      link: "#"
    },
    {
      title: "Wenwang: Toward Effectively Generating Code Beyond Standalone Functions",
      authors: "Hao Yu, Bo Shen, Jiaxin Zhang, Shaoxin Lin, Lin Li, Guangtai Liang, Ying Li, Qianxiang Wang, Tao Xie",
      venue: "TOSEM",
      year: "2024",
      link: "#"
    },
    {
      title: "Focused: An Approach to Framework-oriented Cross-language Link Specification and Detection",
      authors: "Ailun Yu, Yifan Shi, Bo Shen, Wei Zhang, Haiyan Zhao, Guangtai Liang, Tianyong Wu, Zhi Jin",
      venue: "ICSME",
      year: "2024",
      link: "#"
    },
    { 
        title: "PanGu-Coder: Program Synthesis with Function-Level Language Modeling",
        authors: "Fenia Christopoulou, Gerasimos Lampouras, Milan Gritta, Guchun Zhang, Yinpeng Guo, Zhongqi Li, Qi Zhang, Meng Xiao, Bo Shen, Lin Li, Hao Yu, Li Yan, Pingyi Zhou, Xin Wang, Yuchi Ma, Ignacio Iacobacci, Yasheng Wang, Guangtai Liang, Jiansheng Wei, Xin Jiang, Qianxiang Wang, Qun Liu",
        venue: "ArXiv",
        year: "2022",
        link: "#"
    },
    {
      title: "SoManyConflicts: Resolve Many Merge Conflicts Interactively and Systematically",
      authors: "Bo Shen, Wei Zhang, Ailun Yu, Yifan Shi, Haiyan Zhao, and Zhi Jin",
      venue: "ASE",
      year: "2021",
      link: "#"
    },
    {
      title: "Cross-language Code Coupling Detection: A Preliminary Study on Android Applications",
      authors: "Bo Shen, Wei Zhang, Ailun Yu, Zhao Wei, Guangtai Liang, Haiyan Zhao, and Zhi Jin",
      venue: "ICSME",
      year: "2021",
      link: "#"
    },
    {
        title: "IntelliMerge: A Refactoring-Aware Software Merging Technique",
        authors: "Bo Shen, Wei Zhang, Haiyan Zhao, Guangtai Liang, Zhi Jin, and Qianxiang Wang",
        venue: "OOPSLA",
        year: "2019",
        link: "#"
      }
  ];
  
  const displayPapers = showAllPublications ? [...papers, ...additionalPapers] : papers;
  
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <SectionTitle title="Selected Publications" icon={FileText} />
      
      <div className="space-y-5">
        {displayPapers.map((paper, index) => (
          <div key={index} className={`pb-4 ${index !== displayPapers.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}>
            <h3 className="font-semibold text-lg">
              {paper.title}
              {paper.link && (
                <a href={paper.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2 text-blue-500">
                  <ExternalLink size={14} />
                </a>
              )}
            </h3>
            <p className={`italic mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {paper.authors}
            </p>
            <div className="flex items-center mt-2">
              <span className={`mr-2 px-2 py-1 text-xs rounded-md ${theme === "dark" ? "bg-blue-900/60 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                {paper.venue} {paper.year}
              </span>
              {paper.highlight && (
                <span className={`px-2 py-1 text-xs rounded-md ${theme === "dark" ? "bg-amber-900/60 text-amber-200" : "bg-amber-100 text-amber-800"}`}>
                  {paper.highlight}
                </span>
              )}
            </div>
          </div>
        ))}
        
        <div className="text-center mt-4">
          <Button 
            variant="outline"
            className="text-blue-500 border-blue-500"
            onClick={() => setShowAllPublications(!showAllPublications)}
          >
            {showAllPublications ? "Show Less" : "View All Publications"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface Award {
  title: string;
  organization: string;
  year: string;
}

function Awards() {
  const { theme } = useTheme();
  
  const awards: Award[] = [
    { title: "Top 10 Engineer", organization: "Huawei Beijing Research Institute", year: "2023" },
    { title: "Innovation Pioneer Award", organization: "Huawei Cloud", year: "2023" },
    { title: "Gold Team Award", organization: "Huawei Company", year: "2023" },
    { title: "Outstanding Graduate", organization: "Beijing", year: "2022" },
    { title: "Outstanding Graduate", organization: "Peking University", year: "2022" },
    { title: "Outstanding Scientific Research Award", organization: "Peking University", year: "2022" }
  ];
  
  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <SectionTitle title="Honors & Awards" icon={Award} />
      
      <div className="space-y-3">
        {awards.map((award, index) => (
          <div 
            key={index} 
            className={`flex items-start py-3 ${
              index !== awards.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
            }`}
          >
            <Star className={`mr-3 h-5 w-5 flex-shrink-0 ${theme === "dark" ? "text-amber-400" : "text-amber-500"}`} />
            <div>
              <h3 className="font-medium">{award.title}</h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {award.organization}, {award.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface TimelineItemProps {
  title: string;
  institution: string;
  location: string;
  period: string;
  description?: string;
}

function TimelineItem({ title, institution, location, period, description }: TimelineItemProps) {
  const { theme } = useTheme();
  
  return (
    <div className="relative pl-8 pb-4">
      {/* Timeline dot and line */}
      <div className="absolute left-0 top-1 h-full">
        <div className={`w-4 h-4 rounded-full ${theme === "dark" ? "bg-blue-500" : "bg-blue-500"}`}></div>
        <div className={`absolute top-4 left-1/2 w-0.5 h-full -translate-x-1/2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}></div>
      </div>
      
      {/* Content */}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>{institution}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-sm">
          <MapPin size={14} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{location}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-sm">
          <Calendar size={14} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{period}</span>
        </div>
        {description && (
          <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 