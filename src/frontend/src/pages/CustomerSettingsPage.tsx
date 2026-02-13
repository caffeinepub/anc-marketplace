import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Shield, Lock, Bell, User, Mic, Volume2, Radio, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useVoiceSettings } from '../contexts/VoiceSettingsContext';
import { isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '../lib/voice/browserVoice';
import PolicySignaturesPanel from '../components/policies/PolicySignaturesPanel';

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
          {/* Policy Signatures Panel - Full Width */}
          <div className="md:col-span-2">
            <PolicySignaturesPanel />
          </div>

          {/* Voice & Permissions Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-primary" />
                <CardTitle>Voice & Permissions</CardTitle>
              </div>
              <CardDescription>Configure voice assistant and microphone access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!voiceFeaturesSupported ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Voice features are not available in your current browser. Please use Chrome, Edge, or Safari for full voice support.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Microphone Permission Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Microphone Permission</Label>
                        <p className="text-sm text-muted-foreground">
                          Required for voice input features
                        </p>
                      </div>
                      {getPermissionStatusDisplay()}
                    </div>

                    {micPermissionStatus === 'prompt' && (
                      <Button
                        onClick={handleRequestPermission}
                        disabled={isRequestingPermission || !isMicSupported}
                        className="w-full"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {isRequestingPermission ? 'Requesting...' : 'Request Microphone Access'}
                      </Button>
                    )}

                    {micPermissionStatus === 'denied' && (
                      <div className="space-y-2">
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            Microphone access was denied. To enable voice features, please allow microphone access in your browser settings and try again.
                          </AlertDescription>
                        </Alert>
                        <Button
                          onClick={handleRetryPermission}
                          disabled={isRequestingPermission}
                          variant="outline"
                          className="w-full"
                        >
                          Retry Permission Request
                        </Button>
                      </div>
                    )}

                    {micPermissionStatus === 'unavailable' && (
                      <Alert>
                        <AlertDescription className="text-sm">
                          Microphone is not available on this device or browser.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Voice Settings (only show if permission granted) */}
                  {micPermissionStatus === 'granted' && (
                    <>
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Radio className="h-4 w-4 text-primary" />
                              <Label htmlFor="voice-activation-setting" className="text-base font-semibold cursor-pointer">
                                Voice Activation
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Continuously listen for voice input while assistant is open
                            </p>
                          </div>
                          <Switch
                            id="voice-activation-setting"
                            checked={preferences.voiceActivationEnabled}
                            onCheckedChange={handleVoiceActivationToggle}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4 text-primary" />
                              <Label htmlFor="spoken-replies-setting" className="text-base font-semibold cursor-pointer">
                                Spoken Replies
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Read assistant responses aloud automatically
                            </p>
                          </div>
                          <Switch
                            id="spoken-replies-setting"
                            checked={preferences.spokenRepliesEnabled}
                            onCheckedChange={setSpokenRepliesEnabled}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Profile management features coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your account is secured with Internet Identity passkey authentication.
              </p>
              <Button variant="outline" asChild>
                <Link to="/privacy-policy">
                  <Shield className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>General account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Additional account settings coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
