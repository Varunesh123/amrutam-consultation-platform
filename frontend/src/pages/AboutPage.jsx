import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Award, Users, Globe, Heart, Leaf, Shield, Clock, Star } from 'lucide-react';

// Team member data with enhanced profiles
const teamMembers = [
  {
    name: 'Varunesh Pathak',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 18+ years of experience in Ayurveda and wellness. Founded Amrutam in 2006 with a mission to democratize authentic Ayurvedic healthcare.',
    experience: '18+ Years',
    expertise: ['Ayurvedic Medicine', 'Business Strategy', 'Healthcare Innovation'],
    achievements: ['Featured in Forbes India', 'Ayurveda Entrepreneur Award 2020'],
    image: 'https://via.placeholder.com/150?text=AG&bg=3B6B47&color=fff'
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Chief Ayurvedic Consultant',
    bio: 'Renowned Ayurvedic physician with BAMS from Gujarat Ayurved University. Specializes in Panchakarma therapy and chronic disease management through natural healing.',
    experience: '15+ Years',
    expertise: ['Panchakarma Therapy', 'Chronic Disease Treatment', 'Women\'s Health'],
    achievements: ['Published 25+ research papers', 'Gold Medalist in BAMS'],
    image: 'https://via.placeholder.com/150?text=PS&bg=C19A6B&color=fff'
  },
  {
    name: 'Rahul Verma',
    role: 'Lead Technology Officer',
    bio: 'Tech innovator bridging ancient wisdom with modern technology. Leading the development of Amrutam\'s AI-powered consultation platform and telemedicine solutions.',
    experience: '12+ Years',
    expertise: ['Healthcare Technology', 'AI/ML', 'Telemedicine Platforms'],
    achievements: ['Built India\'s first Ayurveda AI assistant', 'Patent holder in health-tech'],
    image: 'https://via.placeholder.com/150?text=RV&bg=2D5A3D&color=fff'
  },
  {
    name: 'Dr. Meera Patel',
    role: 'Director of Research',
    bio: 'Leading researcher in modern applications of Ayurveda. PhD in Pharmacology with focus on standardization of Ayurvedic medicines and clinical trials.',
    experience: '20+ Years',
    expertise: ['Clinical Research', 'Drug Standardization', 'Quality Assurance'],
    achievements: ['100+ clinical studies', 'WHO consultant on traditional medicine'],
    image: 'https://via.placeholder.com/150?text=MP&bg=8B4513&color=fff'
  }
];

// Enhanced FAQ data
const faqs = [
  {
    question: 'What makes Amrutam different from other healthcare platforms?',
    answer: 'Amrutam is India\'s first comprehensive Ayurvedic wellness ecosystem. We combine 5000-year-old Ayurvedic wisdom with modern technology, offering personalized consultations, authentic medicines, lifestyle guidance, and continuous wellness monitoring - all in one integrated platform.'
  },
  {
    question: 'How do you ensure the authenticity of Ayurvedic treatments?',
    answer: 'All our doctors are certified BAMS practitioners with verified credentials. Our medicines are manufactured in GMP-certified facilities using traditional methods. We maintain strict quality control with lab testing for purity, potency, and safety of all products.'
  },
  {
    question: 'What services does Amrutam offer?',
    answer: 'We offer online Ayurvedic consultations, personalized medicine delivery, wellness coaching, Panchakarma therapy guidance, diet and lifestyle plans, meditation sessions, yoga classes, and 24/7 health monitoring through our mobile app.'
  },
  {
    question: 'Is online Ayurvedic consultation as effective as in-person visits?',
    answer: 'Our platform uses advanced diagnostic tools including pulse analysis through wearables, detailed health questionnaires, and video consultations for visual examination. Studies show 85% patient satisfaction with our online consultations, with the option to schedule in-person visits when needed.'
  },
  {
    question: 'How does Amrutam ensure data privacy and security?',
    answer: 'We use military-grade encryption, comply with international healthcare data standards (HIPAA, GDPR), and store data in ISO-certified servers. Our platform undergoes regular security audits, and we never share personal health information with third parties.'
  },
  {
    question: 'What are the consultation fees and how does payment work?',
    answer: 'Consultation fees range from ₹300-₹1500 based on doctor experience and specialization. We accept all major payment methods and offer EMI options. First-time users get 20% discount, and we have special packages for chronic condition management.'
  }
];

// Amrutam projects and initiatives
const projects = [
  {
    title: 'AI-Powered Ayurvedic Assistant',
    description: 'Revolutionary AI that analyzes symptoms using Ayurvedic principles to provide preliminary health insights and recommendations.',
    impact: '50K+ users helped daily',
    status: 'Live',
    icon: '🤖'
  },
  {
    title: 'Digital Pulse Diagnosis',
    description: 'Innovative wearable technology that captures pulse patterns for remote Nadi Pariksha (pulse diagnosis) consultations.',
    impact: '90% diagnostic accuracy',
    status: 'Beta',
    icon: '💓'
  },
  {
    title: 'Ayurveda Research Foundation',
    description: 'Collaborative research initiative with top universities to validate Ayurvedic treatments through modern clinical trials.',
    impact: '25+ ongoing studies',
    status: 'Active',
    icon: '🔬'
  },
  {
    title: 'Community Wellness Program',
    description: 'Free healthcare camps and Ayurveda awareness programs in rural areas, making traditional medicine accessible to all.',
    impact: '1 Lakh+ people reached',
    status: 'Ongoing',
    icon: '🏥'
  }
];

const stats = [
  { label: 'Certified Doctors', value: '500+', icon: Users },
  { label: 'Happy Patients', value: '1M+', icon: Heart },
  { label: 'Cities Covered', value: '200+', icon: Globe },
  { label: 'Success Rate', value: '92%', icon: Award }
];

const AboutPage = () => {
  const [currentMember, setCurrentMember] = useState(0);
  const [direction, setDirection] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentMember((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentMember((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-amber-50 via-white to-green-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-amber-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-12 h-12 mr-3 text-amber-200" />
            <h1 className="text-4xl font-bold">About Amrutam</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-amber-50">
            India's leading Ayurvedic wellness platform, connecting ancient wisdom with modern healthcare. 
            Founded in 2006, we've transformed over 1 million lives through personalized Ayurvedic treatments, 
            making traditional medicine accessible in the digital age.
          </p>
          <div className="flex flex-wrap justify-center mt-8 space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-200">18+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-200">1M+</div>
              <div className="text-sm">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-200">500+</div>
              <div className="text-sm">Expert Doctors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-green-600" />
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To democratize authentic Ayurvedic healthcare by bridging the gap between ancient wisdom and modern technology. 
            We strive to make personalized, effective, and affordable Ayurvedic treatments accessible to every individual, 
            regardless of their location or economic background.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-6 h-6 mr-2 text-amber-600" />
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To become the world's most trusted Ayurvedic wellness ecosystem, where traditional healing meets cutting-edge 
            technology. We envision a future where preventive healthcare through Ayurveda becomes the global standard for 
            holistic well-being.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-green-700" />
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects & Initiatives */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
          <Globe className="w-6 h-6 mr-2 text-green-600" />
          Our Projects & Initiatives
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl border border-green-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{project.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Live' ? 'bg-green-100 text-green-800' :
                  project.status === 'Beta' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-3">{project.description}</p>
              <div className="flex items-center text-sm">
                <Award className="w-4 h-4 mr-1 text-green-600" />
                <span className="text-green-700 font-medium">{project.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Team Carousel */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
          <Users className="w-6 h-6 mr-2 text-green-600" />
          Meet Our Leadership Team
        </h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={teamMembers[currentMember].image}
                  alt={teamMembers[currentMember].name}
                  className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
                />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {teamMembers[currentMember].name}
                </h3>
                <p className="text-amber-700 font-semibold text-lg mb-3">
                  {teamMembers[currentMember].role}
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {teamMembers[currentMember].bio}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Experience:</p>
                    <p className="text-green-700">{teamMembers[currentMember].experience}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {teamMembers[currentMember].expertise.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-2">Key Achievements:</p>
                  <ul className="text-sm text-gray-600">
                    {teamMembers[currentMember].achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-center mb-1">
                        <Award className="w-3 h-3 mr-2 text-amber-600" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-green-200 hover:bg-green-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-green-700" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-green-200 hover:bg-green-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-green-700" />
          </button>
        </div>
        
        <div className="flex justify-center space-x-3 mt-6">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMember(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentMember ? 'bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl">
            <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Authenticity</h3>
            <p className="text-gray-600 text-sm">Preserving traditional Ayurvedic principles while embracing modern innovation.</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl">
            <Heart className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Compassion</h3>
            <p className="text-gray-600 text-sm">Treating every patient with empathy, respect, and personalized care.</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-xl">
            <Clock className="w-12 h-12 mx-auto mb-4 text-green-700" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Excellence</h3>
            <p className="text-gray-600 text-sm">Continuously improving our services and maintaining the highest quality standards.</p>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
          <Plus className="w-6 h-6 mr-2 text-green-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-green-100">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-start py-4 text-left hover:bg-green-25 rounded-lg px-2 transition-colors"
              >
                <span className="text-lg font-medium text-gray-800 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 mt-1">
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-green-700" />
                  ) : (
                    <Plus className="w-5 h-5 text-green-700" />
                  )}
                </div>
              </button>
              {openFaq === index && (
                <div className="text-gray-600 pb-4 px-2 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-8 text-center">
        <div className="bg-gradient-to-r from-green-600 to-amber-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Begin Your Wellness Journey?</h2>
          <p className="text-lg mb-6 text-green-50">
            Join thousands of satisfied patients who have transformed their health with Amrutam's personalized Ayurvedic care.
          </p>
          <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors shadow-lg">
            Book Your Consultation Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;