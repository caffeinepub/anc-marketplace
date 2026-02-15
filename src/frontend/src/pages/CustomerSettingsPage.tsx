import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Shield, Lock, Bell, User, Mic, Volume2, Radio, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useVoiceSettings } from '../contexts/VoiceSettingsContext';
import { isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '../lib/voice/browserVoice';

export default function CustomerSettingsPage() {
  const { identity } = useInternetIdentity();
  const {
    micPermissionStatus,
    isRequestingPermission,
    isMicSupported,
    requestMicPermission,
    retryMicPermission,
    preferences,
    setVoiceActivationEnabled,
    setSpokenRepliesEnabled,
  } = useVoiceSettings();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Shield className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please log in to access settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const voiceFeaturesSupported = isSpeechRecognitionSupported() && isSpeechSynthesisSupported();

  const handleRequestPermission = async () => {
    await requestMicPermission();
  };

  const handleRetryPermission = async () => {
    await retryMicPermission();
  };

  const handleVoiceActivationToggle = async (enabled: boolean) => {
    if (enabled && micPermissionStatus !== 'granted') {
      const granted = await requestMicPermission();
      if (!granted) return;
    }
    setVoiceActivationEnabled(enabled);
  };

  const getPermissionStatusDisplay = () => {
    switch (micPermissionStatus) {
      case 'granted':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Granted</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Denied</span>
          </div>
        );
      case 'unavailable':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Not Available</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Not Requested</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
          {/* Voice & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice & Permissions
              </CardTitle>
              <CardDescription>Configure voice features and microphone access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!voiceFeaturesSupported && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Voice features are not supported in your browser. Please use Chrome, Edge, or Safari.
                  </AlertDescription>
                </Alert>
              )}

              {voiceFeaturesSupported && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Microphone Permission</Label>
                      {getPermissionStatusDisplay()}
                    </div>

                    {micPermissionStatus === 'prompt' && (
                      <Button
                        onClick={handleRequestPermission}
                        disabled={isRequestingPermission}
                        className="w-full"
                        variant="outline"
                      >
                        {isRequestingPermission ? 'Requesting...' : 'Request Microphone Access'}
                      </Button>
                    )}

                    {micPermissionStatus === 'denied' && (
                      <div className="space-y-2">
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            Microphone access was denied. Please enable it in your browser settings.
                          </AlertDescription>
                        </Alert>
                        <Button onClick={handleRetryPermission} variant="outline" className="w-full">
                          Retry Permission Request
                        </Button>
                      </div>
                    )}
                  </div>

                  {micPermissionStatus === 'granted' && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Radio className="h-4 w-4 text-primary" />
                            <Label htmlFor="voice-activation" className="cursor-pointer">
                              Voice Activation
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Automatically listen when assistant is open
                          </p>
                        </div>
                        <Switch
                          id="voice-activation"
                          checked={preferences.voiceActivationEnabled}
                          onCheckedChange={handleVoiceActivationToggle}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4 text-primary" />
                            <Label htmlFor="spoken-replies" className="cursor-pointer">
                              Spoken Replies
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Hear assistant responses read aloud
                          </p>
                        </div>
                        <Switch
                          id="spoken-replies"
                          checked={preferences.spokenRepliesEnabled}
                          onCheckedChange={setSpokenRepliesEnabled}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Profile management features coming soon.
              </p>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your data and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Privacy settings coming soon.
              </p>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings coming soon.
              </p>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your account and authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account management features coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
