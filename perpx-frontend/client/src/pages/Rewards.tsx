import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";
import ConnectWalletScreen from "@/components/ConnectWalletScreen";
import { 
  Gift, 
  Trophy, 
  Star, 
  Zap, 
  CheckCircle2, 
  Circle,
  Twitter,
  MessageCircle,
  Users
} from "lucide-react";

export default function Rewards() {
  const { t } = useLanguage();
  const { isConnected } = useWallet();
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => new Set(Array.from(prev).concat(taskId)));
  };

  const handleLogin = () => {
    handleTaskComplete('daily-login');
    alert(t('rewards.loginSuccess'));
  };

  const handleDemoTrade = () => {
    handleTaskComplete('daily-demo');
    alert(t('rewards.demoSuccess'));
  };

  const handleSocialPost = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: 'https://twitter.com/intent/tweet?text=PerpXで取引を始めました！&url=https://perpx.com',
      telegram: 'https://t.me/share/url?url=https://perpx.com&text=PerpXで取引を始めました！',
    };
    
    window.open(urls[platform], '_blank');
    
    // 投稿後にタスク完了とする（実際にはバックエンドで確認が必要）
    setTimeout(() => {
      handleTaskComplete(`daily-sns-${platform}`);
      alert(t('rewards.snsSuccess'));
    }, 2000);
  };

  const handleWeeklyLogin = () => {
    handleTaskComplete('weekly-login');
    alert(t('rewards.weeklyLoginSuccess'));
  };

  const handleCommunityJoin = (platform: string) => {
    const urls: Record<string, string> = {
      discord: 'https://discord.gg/perpx',
      telegram: 'https://t.me/perpx',
    };
    
    window.open(urls[platform], '_blank');
    
    setTimeout(() => {
      handleTaskComplete(`weekly-community-${platform}`);
      alert(t('rewards.communitySuccess'));
    }, 2000);
  };

  const handleGuildJoin = () => {
    handleTaskComplete('special-guild');
    alert(t('rewards.guildSuccess'));
  };

  const dailyTasks = [
    {
      id: 'daily-login',
      title: t('rewards.loginBonus'),
      description: t('rewards.loginBonusDesc'),
      points: 1,
      action: handleLogin,
      buttonText: t('rewards.login'),
    },
    {
      id: 'daily-demo',
      title: t('rewards.demoTrade'),
      description: t('rewards.demoTradeDesc'),
      points: 5,
      action: handleDemoTrade,
      buttonText: t('rewards.trade'),
    },
    {
      id: 'daily-sns-twitter',
      title: t('rewards.twitterPost'),
      description: t('rewards.twitterPostDesc'),
      points: 5,
      action: () => handleSocialPost('twitter'),
      buttonText: t('rewards.post'),
      icon: Twitter,
    },
  ];

  const weeklyTasks = [
    {
      id: 'weekly-login',
      title: t('rewards.weeklyLogin'),
      description: t('rewards.weeklyLoginDesc'),
      points: 10,
      action: handleWeeklyLogin,
      buttonText: t('rewards.claim'),
    },
    {
      id: 'weekly-community-discord',
      title: t('rewards.joinDiscord'),
      description: t('rewards.joinDiscordDesc'),
      points: 30,
      action: () => handleCommunityJoin('discord'),
      buttonText: t('rewards.join'),
      icon: MessageCircle,
    },
    {
      id: 'weekly-community-telegram',
      title: t('rewards.joinTelegram'),
      description: t('rewards.joinTelegramDesc'),
      points: 30,
      action: () => handleCommunityJoin('telegram'),
      buttonText: t('rewards.join'),
      icon: MessageCircle,
    },
  ];

  const specialTasks = [
    {
      id: 'special-guild',
      title: t('rewards.joinGuild'),
      description: t('rewards.joinGuildDesc'),
      points: 50,
      action: handleGuildJoin,
      buttonText: t('rewards.join'),
      icon: Users,
    },
  ];

  const calculateDailyPoints = () => {
    return dailyTasks.reduce((sum, task) => {
      return sum + (completedTasks.has(task.id) ? task.points : 0);
    }, 0);
  };

  const calculateWeeklyPoints = () => {
    return weeklyTasks.reduce((sum, task) => {
      return sum + (completedTasks.has(task.id) ? task.points : 0);
    }, 0);
  };

  const calculateSpecialPoints = () => {
    return specialTasks.reduce((sum, task) => {
      return sum + (completedTasks.has(task.id) ? task.points : 0);
    }, 0);
  };

  const totalPoints = calculateDailyPoints() + calculateWeeklyPoints() + calculateSpecialPoints();

  const renderTask = (task: any) => {
    const isCompleted = completedTasks.has(task.id);
    const TaskIcon = task.icon || Star;

    return (
      <Card key={task.id} className="glass-card p-6 hover-reveal">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <TaskIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{task.title}</h3>
                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </div>
              <p className="text-sm text-white/60 mb-2">{task.description}</p>
              <div className="text-primary font-bold">+{task.points} {t('rewards.points')}</div>
            </div>
          </div>
        </div>
        <Button
          onClick={task.action}
          disabled={isCompleted}
          className={`w-full ${
            isCompleted
              ? 'bg-green-500/20 text-green-500 cursor-not-allowed'
              : 'neuro-button micro-bounce'
          }`}
        >
          {isCompleted ? t('rewards.completed') : task.buttonText}
        </Button>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Connect Wallet Screen when wallet is not connected */}
      {!isConnected && (
        <ConnectWalletScreen
          title="Connect Wallet"
          description="Connect your wallet to access rewards, complete tasks, and earn points."
        />
      )}

      {/* Main Content - Only show when wallet is connected */}
      {isConnected && (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('nav.rewards')}</h1>
          <p className="text-white/60">{t('rewards.dailyTasks')} & {t('rewards.weeklyTasks')}</p>
        </div>

        {/* Total Points */}
        <div className="glass-card rounded-xl p-8 mb-8 text-center">
          <div className="text-sm text-white/60 mb-2">Total Points</div>
          <div className="text-4xl sm:text-5xl font-bold text-white mb-4">{totalPoints} pt</div>
          <div className="text-sm text-green-500 mb-2">≈ ${totalPoints} USD</div>
          <div className="text-xs text-white/60">
            {t('rewards.dailyTasks')}: {calculateDailyPoints()}pt | {t('rewards.weeklyTasks')}: {calculateWeeklyPoints()}pt | {t('rewards.specialTasks')}: {calculateSpecialPoints()}pt
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">{t('rewards.dailyTasks')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyTasks.map(renderTask)}
          </div>
          <div className="mt-4 text-sm text-white/60">
            Monthly: {dailyTasks.reduce((sum, t) => sum + t.points, 0) * 30} {t('rewards.points')}
          </div>
        </div>

        {/* Weekly Tasks */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">{t('rewards.weeklyTasks')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyTasks.map(renderTask)}
          </div>
          <div className="mt-4 text-sm text-white/60">
            Monthly: {weeklyTasks.reduce((sum, t) => sum + t.points, 0) * 4} {t('rewards.points')}
          </div>
        </div>

        {/* Special Tasks */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">{t('rewards.specialTasks')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialTasks.map(renderTask)}
          </div>
        </div>

        {/* Reward History */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">獲得履歴</h2>
          <div className="space-y-4">
            {Array.from(completedTasks).map((taskId, index) => {
              const task = [...dailyTasks, ...weeklyTasks, ...specialTasks].find(t => t.id === taskId);
              if (!task) return null;
              
              return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white font-medium">{task.title}</div>
                    <div className="text-sm text-white/60">{new Date().toLocaleDateString('ja-JP')}</div>
                  </div>
                  <div className="text-green-500 font-bold">+{task.points} pt</div>
                </div>
              );
            })}
            {completedTasks.size === 0 && (
              <div className="text-sm text-white/60 text-center py-8">
                まだタスクを完了していません
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

