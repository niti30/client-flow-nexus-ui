
import React from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Profile = () => {
  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                      <div className="h-32 w-32 rounded-full bg-[#1785c1] text-white flex items-center justify-center text-4xl">
                        AU
                      </div>
                      <Button variant="outline" className="mt-4 w-full">
                        Change Avatar
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Admin" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="User" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@example.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" defaultValue="System Administrator" />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
