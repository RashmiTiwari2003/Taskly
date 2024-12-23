'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { ReactTyped } from "react-typed";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Github, Linkedin, SquareMenu } from "lucide-react"
import Image from 'next/image';

type Props = {}

const page = (props: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'footer'];
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop - 100 && // Adjust offset as needed
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div id='home' className='flex flex-col justify-center items-start bg-[url(/images/bg-landing-page.jpg)] bg-opacity-50 bg-cover w-full h-screen'>
        <div className="top-0 z-20 fixed flex bg-slate-100 bg-opacity-0 w-full h-14">
          <div className={`flex items-center mx-4 text-3xl font-black ${activeSection === 'about' || activeSection === 'services' || activeSection === 'footer' ? 'text-black' : 'text-white'}`}>Taskly</div>
          <div className='flex ml-auto'>
            <div className='md:flex justify-center items-center gap-8 hidden mx-6 md:w-full font-serif text-lg'>
              {['home', 'about', 'services', 'footer'].map((section) => (
                <Link
                  key={section}
                  className={`hover:underline ${activeSection === 'about' || activeSection === 'services' || activeSection === 'footer' ? 'text-black' : 'text-white'}`}
                  href={`#${section}`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Link>
              ))}
            </div>
          </div>
          <div className='flex justify-center items-center md:hidden mr-4 ml-auto'>
            <Sheet>
              <SheetTrigger asChild>
                <button><SquareMenu size={35} absoluteStrokeWidth /></button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-5 mt-4 text-lg">
                  <Link className='px-2 py-1 hover:underline' href={"#home"}>Home</Link>
                  <Link className='px-2 py-1 hover:underline' href={"#about"}>About</Link>
                  <Link className='px-2 py-1 hover:underline' href={"#services"}>Services</Link>
                  <Link className='px-2 py-1 hover:underline' href={"#footer"}>Footer</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className='flex flex-col justify-center items-start gap-6 px-12 lg:px-36'>
          <div className='text-4xl text-white md:text-6xl lg:text-7xl'>
            <ReactTyped
              strings={['Taskly']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>
          <div className='text-white text-xl md:text-2xl lg:text-4xl'>Task Management made easier.</div>
          <div className='w-64 md:w-3/5 text-sm text-white md:text-base lg:text-xl'>Ditch the chaos and take control of your workday with Taskly - the intuitive task management solution that keeps you organized and productive.</div>
          <div className='flex gap-2 text-white'>
            <div className='text-white'>Access Taskly now</div>
            <div className='font-semibold text-lg text-white underline'><Link href={'/login'}>Login</Link></div>
          </div>
        </div>
      </div>
      <div id='about' className='flex bg-slate-50 py-20 w-full h-full'>
        <div className={`flex about-block flex-col justify-center w-full items-center gap-4 px-12 md:px-8 lg:px-36 lg:w-2/3`}>
          <div className='font-bold text-2xl lg:text-4xl'>About</div>
          <div className='text-center lg:text-lg'>
            At Taskly, we've developed a sophisticated platform tailored to elevate task management. Designed with precision and an acute understanding of modern workflows, Taskly empowers users to efficiently organize, prioritize, and execute their projects with confidence. By harmonizing functionality and simplicity, we provide a seamless experience that meets the diverse needs of professionals across industries. Taskly not only streamlines project oversight but fosters a unified, collaborative environment where teams can thrive. With a focus on intuitive design and practical features, Taskly ensures every project unfolds with clarity and precision.
          </div>
        </div>
        <div className='about-block flex justify-center items-center md:pr-10 lg:pr-0'>
          <Image className='md:block hidden shadow-lg rounded-3xl' src='/images/task-management.jpg' alt='about-image' width={400} height={400} />
        </div>
      </div>
      <div id='services' className='flex flex-col justify-start items-center gap-4 md:gap-8 lg:gap-12 bg-yellow-50 py-10 lg:py-20 w-full h-full'>
        <div className='font-semibold text-black md:text-3xl'>Conquer your workflow and boost productivity</div>
        <div className='flex flex-col justify-center md:justify-normal items-center md:items-baseline gap-y-8 px-6 md:px-12 py-6 md:py-0 w-full'>
          <div className='flex md:flex-row flex-col flex-wrap justify-center md:justify-start items-center w-full transition-all group'>
            <div className='flex md:flex-row flex-col items-center gap-4 bg-white group-hover:shadow-lg group-hover:shadow-yellow-500 rounded-lg w-64 md:w-3/4 lg:w-1/2 h-48 md:h-36 transition-all'>
              <div className='flex justify-center items-center bg-yellow-400 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:max-w-28 lg:max-w-40 md:min-h-full max-h-10'>
                <Image className='group-hover:animate-shake' src='/images/task.png' alt='task-management' width={100} height={100} quality={100} />
              </div>
              <div className='flex flex-col gap-2 px-3 text-center md:text-start'>
                <div className='font-semibold lg:font-normal text-sm lg:text-base'>Intuitive kanban board for visual task tracking</div>
                <div className='text-xs md:text-sm'>
                  Visualize your work with Taskly's intuitive Kanban boards. Track progress, prioritize tasks, and maintain clarity on every step of your project.
                </div>
              </div>
            </div>
          </div>
          <div className='flex md:flex-row flex-col flex-wrap justify-center md:justify-center items-center w-full transition-all group'>
            <div className='flex md:flex-row flex-col items-center gap-4 bg-white group-hover:shadow-lg group-hover:shadow-pink-500 rounded-lg w-64 md:w-3/4 lg:w-1/2 h-48 md:h-36 transition-all'>
              <div className='flex justify-center items-center bg-pink-400 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:max-w-28 lg:max-w-40 md:min-h-full max-h-10'>
                <Image className='group-hover:animate-shake' src='/images/task.png' alt='task-management' width={100} height={100} quality={100} />
              </div>
              <div className='flex flex-col gap-2 px-3 text-center md:text-start'>
                <div className='font-semibold lg:font-normal text-sm lg:text-base'>Seamless user creation and user invites</div>
                <div className='text-xs md:text-sm'>
                  Our platform allows you to quickly add users, assign roles, and organize teams with just a few clicks. Invite team members effortlessly with a single invitation.
                </div>
              </div>
            </div>
          </div>
          <div className='flex md:flex-row flex-col flex-wrap justify-center md:justify-end items-center md:items-end w-full transition-all group'>
            <div className='flex md:flex-row flex-col items-center gap-4 bg-white group-hover:shadow-lg group-hover:shadow-green-500 rounded-lg w-64 md:w-3/4 lg:w-1/2 h-48 md:h-36 transition-all'>
              <div className='flex justify-center items-center bg-green-400 rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:max-w-28 lg:max-w-40 md:min-h-full max-h-10'>
                <Image className='group-hover:animate-shake' src='/images/task.png' alt='task-management' width={100} height={100} quality={100} />
              </div>
              <div className='flex flex-col gap-2 px-3 text-center md:text-start'>
                <div className='font-semibold lg:font-normal text-sm lg:text-base'>Customizable Workflows</div>
                <div className='text-xs md:text-sm'>
                  Tailor your project management to fit your unique needs with fully customizable workflows. Create, edit, and organize task boards, columns, and categories to align with your team’s processes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='footer' className='flex md:flex-row flex-col justify-center items-center gap-12 bg-slate-50 px-12 md:px-36 py-6 md:py-20 w-full h-full'>
        <div className='flex flex-col justify-center items-center gap-4 bg-white shadow-xl px-12 py-6 rounded-xl' >
          <Image className='rounded-full' src='/images/new-sc-photo.jpg' alt='profile-photo' width={200} height={200} />
          <div className='font-semibold text-lg'>Rashmi Tiwari</div>
          <div className='text-center'>
            SDE Intern | Web Developer | ML
          </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-3'>
          <div className='flex justify-center items-center gap-3'>
            <div className='text-sm'>
              Check Out My Other Projects:
            </div>
            <Link className='text-blue-500 text-sm underline' target='blank' href={'https://rashmis-portfolio.vercel.app/'}>Portfolio</Link>
          </div>
          <div className='flex gap-5'>
            <Link className='transition ease-in-out hover:scale-110' target='blank' href={'https://github.com/rashmiTiwari2003/'}><Github size={25} /></Link>
            <Link className='transition ease-in-out hover:scale-110' target='blank' href={'https://www.linkedin.com/in/rashmitiwari03'}><Linkedin size={25} /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page