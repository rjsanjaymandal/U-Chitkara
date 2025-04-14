import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import {
  getEnrolledStudents,
  addStudentToCourse,
  removeStudentFromCourse,
} from "../../../../services/operations/studentManagementAPI";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  FaTrash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSearch,
} from "react-icons/fa";
import { HiOutlineUserAdd, HiOutlineMail } from "react-icons/hi";
import { RiUserAddLine } from "react-icons/ri";
import { BiSelectMultiple } from "react-icons/bi";
import { toast } from "react-hot-toast";

const ManageStudents = () => {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [token]);

  // Fetch students when a course is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedCourse) {
        setLoading(true);
        const result = await getEnrolledStudents(selectedCourse, token);
        if (result) {
          setStudents(result);
          setFilteredStudents(result);
        }
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedCourse, token]);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle course selection
  const handleCourseSelect = (e) => {
    setSelectedCourse(e.target.value);
    setSearchQuery(""); // Reset search when changing courses
  };

  // Handle adding a student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Student Email:", studentEmail);
    console.log("Selected Course:", selectedCourse);
    console.log("Token:", token);

    if (!studentEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      console.log("Calling addStudentToCourse");
      const success = await addStudentToCourse(
        selectedCourse,
        studentEmail,
        token
      );
      console.log("addStudentToCourse result:", success);

      if (success) {
        // Refresh student list
        console.log("Refreshing student list");
        const result = await getEnrolledStudents(selectedCourse, token);
        console.log("getEnrolledStudents result:", result);

        if (result) {
          setStudents(result);
          // Reset search when adding a new student
          setSearchQuery("");
          setFilteredStudents(result);
        }
        setStudentEmail("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error in handleAddStudent:", error);
      toast.error("Failed to add student: " + error.message);
    }
  };

  // Handle removing a student
  const handleRemoveStudent = async (studentId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this student from the course?"
      )
    ) {
      const success = await removeStudentFromCourse(
        selectedCourse,
        studentId,
        token
      );
      if (success) {
        // Refresh student list
        const result = await getEnrolledStudents(selectedCourse, token);
        if (result) {
          setStudents(result);
          // Apply current search filter to new results
          if (searchQuery.trim() !== "") {
            const filtered = result.filter(
              (student) =>
                student.firstName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                student.lastName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStudents(filtered);
          } else {
            setFilteredStudents(result);
          }
        }
      }
    }
  };

  return (
    <div className="text-white max-w-[1200px] mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text">
            Student Management
          </h1>
          <p className="text-richblack-300 mt-2">
            Manage your course enrollments and student access
          </p>
        </div>
        <div className="flex items-center gap-2 bg-richblack-800 p-2 rounded-md border border-richblack-700 w-full md:w-auto">
          <FaSearch className="text-richblack-300" />
          <input
            type="text"
            placeholder="Search students..."
            className="bg-transparent border-none outline-none text-white w-full"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={!selectedCourse || students.length === 0}
          />
        </div>
      </div>

      {/* Course Selection Card */}
      <div className="bg-richblack-800 rounded-xl p-6 mb-8 border border-richblack-700 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-md">
            <FaChalkboardTeacher className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-semibold">Select Course</h2>
        </div>
        <p className="text-richblack-300 mb-4">
          Choose a course to view and manage enrolled students
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <BiSelectMultiple className="text-richblack-400" />
          </div>
          <select
            id="courseSelect"
            className="w-full bg-richblack-700 text-white py-3 pl-10 pr-4 rounded-md border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onChange={handleCourseSelect}
            value={selectedCourse || ""}
          >
            <option value="">-- Select a course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Student Section */}
      {selectedCourse && (
        <div className="mb-8">
          {!showAddForm ? (
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA] hover:from-[#12D8FA] hover:to-[#1FA2FF] text-white px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setShowAddForm(true)}
            >
              <RiUserAddLine className="text-xl" /> Add New Student
            </button>
          ) : (
            <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 shadow-md w-full md:w-2/3 lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-600 p-2 rounded-md">
                  <HiOutlineUserAdd className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-semibold">Add Student to Course</h2>
              </div>

              <form onSubmit={handleAddStudent}>
                <div className="mb-6 relative">
                  <label
                    htmlFor="studentEmail"
                    className="block mb-2 text-richblack-300 font-medium"
                  >
                    Student Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <HiOutlineMail className="text-richblack-400" />
                    </div>
                    <input
                      type="email"
                      id="studentEmail"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Enter student email"
                      className="w-full bg-richblack-700 text-white py-3 pl-10 pr-4 rounded-md border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <p className="text-xs text-richblack-300 mt-2">
                    Student will receive an email notification about enrollment
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA] hover:from-[#12D8FA] hover:to-[#1FA2FF] text-white px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto"
                  >
                    <RiUserAddLine /> Add Student
                  </button>
                  <button
                    type="button"
                    className="bg-richblack-700 text-white px-6 py-3 rounded-md font-medium hover:bg-richblack-600 transition-all duration-300 w-full md:w-auto"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Students Table Section */}
      {selectedCourse && (
        <div className="bg-richblack-800 rounded-xl p-6 border border-richblack-700 shadow-md mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 p-2 rounded-md">
              <FaUserGraduate className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="bg-richblack-700 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FaUserGraduate className="text-5xl text-richblack-400" />
              </div>
              <p className="text-richblack-300 text-lg">
                No students enrolled in this course yet.
              </p>
              <p className="text-richblack-400 mt-2">
                Add students to get started.
              </p>
            </div>
          ) : filteredStudents.length === 0 && searchQuery ? (
            <div className="bg-richblack-700 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <FaSearch className="text-5xl text-richblack-400" />
              </div>
              <p className="text-richblack-300 text-lg">
                No students found matching "{searchQuery}"
              </p>
              <p className="text-richblack-400 mt-2">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full border-collapse">
                <Thead>
                  <Tr className="bg-richblack-700 rounded-t-lg">
                    <Th className="p-4 text-left font-semibold text-sm uppercase text-richblack-300 border-b border-richblack-600">
                      Name
                    </Th>
                    <Th className="p-4 text-left font-semibold text-sm uppercase text-richblack-300 border-b border-richblack-600">
                      Email
                    </Th>
                    <Th className="p-4 text-center font-semibold text-sm uppercase text-richblack-300 border-b border-richblack-600">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.map((student) => (
                    <Tr
                      key={student._id}
                      className="border-b border-richblack-700 hover:bg-richblack-700 transition-colors duration-200"
                    >
                      <Td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-richblack-700 h-10 w-10 rounded-full flex items-center justify-center text-blue-500 font-bold">
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{`${student.firstName} ${student.lastName}`}</p>
                            <p className="text-xs text-richblack-300">
                              Student
                            </p>
                          </div>
                        </div>
                      </Td>
                      <Td className="p-4 text-richblack-300">
                        {student.email}
                      </Td>
                      <Td className="p-4 text-center">
                        <button
                          onClick={() => handleRemoveStudent(student._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-200"
                          title="Remove student"
                        >
                          <FaTrash />
                        </button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
