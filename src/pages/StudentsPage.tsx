import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, ExternalLink, MapPin, Star } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { supabase } from '../lib/supabase';

interface Student {
  id: string;
  user_id: string;
  student_id: string;
  full_name: string;
  bio: string | null;
  skills: string[] | null;
  social_links: Record<string, string> | null;
  profile_pic: string | null;
  quote: string | null;
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [allSkills, setAllSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedSkill]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('public', true)
        .order('full_name');

      if (!error && data) {
        setStudents(data);
        
        // Extract all unique skills
        const skills = new Set<string>();
        data.forEach(student => {
          if (student.skills) {
            student.skills.forEach(skill => skills.add(skill));
          }
        });
        setAllSkills(Array.from(skills).sort());
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills?.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by selected skill
    if (selectedSkill) {
      filtered = filtered.filter(student =>
        student.skills?.includes(selectedSkill)
      );
    }

    setFilteredStudents(filtered);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading our amazing classmates...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Class
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get to know the incredible individuals that make up the SOSE Lajpat Nagar Class of 2025. 
            Each profile tells a unique story of talent, passion, and ambition.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, bio, or skills..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">All Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
            {(searchTerm || selectedSkill) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </Card>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or clearing the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} hover className="p-6">
                <div className="space-y-4">
                  {/* Profile Header */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {student.profile_pic ? (
                        <img
                          src={student.profile_pic}
                          alt={student.full_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            {getInitials(student.full_name)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {student.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {student.student_id}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {student.bio && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {student.bio}
                    </p>
                  )}

                  {/* Quote */}
                  {student.quote && (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 text-sm">
                      "{student.quote}"
                    </blockquote>
                  )}

                  {/* Skills */}
                  {student.skills && student.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Skills & Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{student.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {student.social_links && Object.keys(student.social_links).length > 0 && (
                    <div className="flex space-x-2">
                      {Object.entries(student.social_links).slice(0, 3).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          title={platform}
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link to={`/students/${student.student_id}`}>
                      <Button variant="outline" className="w-full">
                        View Full Profile
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentsPage;