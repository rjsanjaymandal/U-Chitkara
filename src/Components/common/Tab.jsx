import React from "react";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { ACCOUNT_TYPE } from "../../utils/constants";

export default function Tab({ tabData, field, setField }) {
  return (
    <div className="flex flex-col items-center my-6">
      <p className="text-richblack-5 text-sm mb-4">
        Join as a Student or Instructor
      </p>
      <div className="flex gap-x-4 w-full max-w-max">
        {tabData.map((tab) => {
          const isActive = field === tab.type;
          const isInstructor = tab.type === ACCOUNT_TYPE.INSTRUCTOR;

          return (
            <button
              key={tab.id}
              onClick={() => setField(tab.type)}
              className={`
                flex items-center gap-2 py-3 px-5 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? isInstructor
                      ? "bg-yellow-50 text-richblack-900 border-2 border-yellow-50"
                      : "bg-richblack-900 text-richblack-5 border-2 border-richblack-900"
                    : "bg-transparent text-richblack-200 border-2 border-richblack-700"
                }
                ${
                  isInstructor && !isActive
                    ? "hover:border-yellow-50 hover:text-yellow-50"
                    : "hover:border-richblack-900"
                }
              `}
            >
              {isInstructor ? (
                <FaChalkboardTeacher
                  className={`text-lg ${
                    isActive ? "text-richblack-900" : "text-richblack-200"
                  }`}
                />
              ) : (
                <FaUserGraduate
                  className={`text-lg ${
                    isActive ? "text-richblack-5" : "text-richblack-200"
                  }`}
                />
              )}
              <span
                className={`${isInstructor && isActive ? "font-semibold" : ""}`}
              >
                {tab?.tabName}
              </span>
              {isInstructor && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? "bg-richblack-900 text-yellow-50"
                      : "bg-richblack-700 text-richblack-200"
                  }`}
                >
                  Recommended
                </span>
              )}
            </button>
          );
        })}
      </div>

      {field === ACCOUNT_TYPE.INSTRUCTOR && (
        <div className="mt-4 bg-richblack-800 p-4 rounded-lg border border-richblack-700 text-richblack-200 text-sm">
          <p className="text-yellow-50 font-semibold mb-2">
            Benefits of being an instructor:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Share your knowledge and expertise</li>
            <li>Earn revenue from course sales</li>
            <li>Help students achieve their goals</li>
            <li>Build your professional brand</li>
          </ul>
        </div>
      )}
    </div>
  );
}
