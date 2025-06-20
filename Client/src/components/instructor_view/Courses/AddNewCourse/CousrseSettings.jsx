import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const CousrseSettings = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Course Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label>Upload Course Image</Label>
                        <Input
                        type="file"
                        accept="image/*"
                       />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CousrseSettings;