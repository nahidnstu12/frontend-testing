import home1 from '@/assets/images/slider-1.png';
import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';
import { BookOpen, TestTube } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchNotices } from '@/store/features/notice/noticeSlice';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { notices, isLoading, error } = useSelector((state: RootState) => state.notices);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  return (
    <FrontendLayout>
      <div className="bg-[#202674]">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-white">Error: {error}</p>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {notices.map((notice) => (
                  <CarouselItem key={notice.id}>
                    <div className="relative h-[400px] w-full">
                      <img
                        src={notice.image}
                        alt={notice.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="max-w-6xl mx-auto">
                          <p className="text-white/80 text-sm mb-2">
                            {new Date(notice.created_at || '').toLocaleDateString()}
                          </p>
                          <h2 className="text-white text-2xl font-bold">{notice.title}</h2>
                          {notice.description && (
                            <p className="text-white/90 mt-2 line-clamp-2">{notice.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          )}
        </div>
      </div>

      <div className="px-10 py-2">
        <p className="text-4xl font-bold mb-3 text-[#202674]">
          To lead the world, be a scholars
        </p>
        <img src={home1} alt="home" className="w-full h-full" />
      </div>
      <div className="flex max-w-6xl mx-auto gap-4">
        <div className="flex flex-col  gap-2 bg-gray-300 p-4 rounded-lg w-1/3">
          <p className="text-base font-medium text-[#202674]">
            Scholars Awarded
          </p>
          <p className="text-4xl font-bold text-[#202674]">500+</p>
        </div>
        <div className="flex flex-col  gap-2 bg-gray-300 p-4 rounded-lg w-1/3">
          <p className="text-base font-medium text-[#202674]">
            Students Supported
          </p>
          <p className="text-4xl font-bold text-[#202674]">1500+</p>
        </div>
        <div className="flex flex-col  gap-2 bg-gray-300 p-4 rounded-lg w-1/3">
          <p className="text-base font-medium text-[#202674]">
            Alumni Success Rate
          </p>
          <p className="text-4xl font-bold text-[#202674]">1000+</p>
        </div>
      </div>
      <div className="flex flex-col max-w-6xl mx-auto gap-4">
        <h1 className="text-4xl font-bold text-[#202674] text-center my-5">
          About Us
        </h1>
        <p className="text-base font-medium text-[#202674]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Quisquam, quos.
        </p>
        <Button
          variant={'outline'}
          className="border-red-500 w-fit text-red-500 mx-auto"
        >
          Read More
        </Button>
      </div>
      <div className="flex flex-col max-w-6xl mx-auto gap-4">
        <h1 className="text-4xl font-bold text-[#202674] text-center my-5">
          Application Process
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 min-h-[180px]">
            <div className="mb-2">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 2v4M16 2v4M4 10h16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="font-bold text-lg text-gray-900">
              Step 1: Fill Out the Application
            </p>
            <p className="text-sm text-gray-500">
              Complete the online application form with accurate details.
            </p>
          </div>
          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 min-h-[180px]">
            <div className="mb-2">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p className="font-bold text-lg text-gray-900">
              Step 2: Submit Documents
            </p>
            <p className="text-sm text-gray-500">
              Upload all required documents for verification.
            </p>
          </div>
          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 min-h-[180px]">
            <div className="mb-2">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 11h8M8 15h6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="font-bold text-lg text-gray-900">
              Step 3: Pay Registration Fee
            </p>
            <p className="text-sm text-gray-500">
              Pay the registration fee to confirm your participation.
            </p>
          </div>
          {/* Step 4 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 min-h-[180px]">
            <div className="mb-2">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 12h8M8 16h6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="font-bold text-lg text-gray-900">
              Step 4: Prepare for the Exam
            </p>
            <p className="text-sm text-gray-500">
              Prepare for the exam based on the syllabus provided.
            </p>
          </div>
          {/* Step 5 */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 min-h-[180px]">
            <div className="mb-2">
              <svg
                className="w-6 h-6 text-blue-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <p className="font-bold text-lg text-gray-900">
              Step 5: Take the Exam
            </p>
            <p className="text-sm text-gray-500">
              Take the exam on the scheduled date and time.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center max-w-6xl mx-auto gap-4 my-10">
        <div className="px-10 py-8 bg-gray-300 text-black rounded-lg cursor-pointer flex-1 text-center text-2xl">
          Register Now
        </div>
        <div className="px-10 py-8 bg-gray-300 text-black rounded-lg cursor-pointer flex-1 text-center text-2xl">
          Pay Fee
        </div>
        <div className="px-10 py-8 bg-gray-300 text-black rounded-lg cursor-pointer flex-1 text-center text-2xl">
          Check Admit Card
        </div>
      </div>

      <div className="flex flex-col max-w-6xl mx-auto gap-4">
        <h1 className="text-4xl font-bold text-[#202674] my-5">
          Contact Information
        </h1>
        <p className="text-base font-medium text-[#202674]">
          For any inquiries, please contact us at:
          <br />
          Email: support@scholarshipexam.com
          <br />
          Phone: (555) 123-4567
          <br />
          Address: 123 Scholarship Avenue, Education City, 12345
        </p>
      </div>
      <div className="flex flex-col max-w-6xl mx-auto gap-4 mb-10">
        <h1 className="text-4xl font-bold text-[#202674] my-5">Resources</h1>
        <div className="flex flex-row max-w-6xl gap-4 bg-gray-200 p-4 rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <div className="bg-white rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-[#202674]" />
              </div>

              <p className="text-base font-medium text-[#202674]">
                Study Material
              </p>
              
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="bg-white rounded-lg p-2">
                <TestTube className="w-6 h-6 text-[#202674]" />
              </div>

              <p className="text-base font-medium text-[#202674]">
                Practice Tests
              </p>
              
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-[#202674] text-white mt-20">
        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Aspiring Achievers Scholarship</h3>
              <p className="text-gray-300 text-sm">
                Empowering students to achieve their dreams through educational opportunities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Scholarships</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Resources</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  123 Scholarship Avenue, Education City, 12345
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  support@scholarshipexam.com
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  (555) 123-4567
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">©2024 Aspiring Achievers Scholarship. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </FrontendLayout>
  );
}
