import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Card className="bg-white shadow-md border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={()=> navigate("/instructor/create-new-course")}

            className="mr-4 bg-black text-white 
              hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 
              hover:scale-[1.02] transition-all duration-100 ease-in-out 
              shadow-md hover:shadow-lg rounded-xl"
          >
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className=" overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    React JS Full Course 2025
                  </TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>$5000</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Delete className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorCourses;
