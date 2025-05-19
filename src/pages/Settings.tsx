
import React from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Settings</h1>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates about system activities</p>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth" className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="twoFactorAuth" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Use dark theme for the interface</p>
                    </div>
                    <Switch id="darkMode" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Change Password</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
