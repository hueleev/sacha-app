'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/shadcn/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/shadcn/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/shadcn/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/shadcn/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/shadcn/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@workspace/ui/components/shadcn/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/shadcn/alert-dialog';
import {
  Plus,
  Star,
  Film,
  Book,
  Headphones,
  Camera,
  User,
  Heart,
  Bookmark,
  HelpCircle,
  X,
  Loader2,
  Trash2,
  Edit,
} from 'lucide-react';
import AddTaste from './add-taste';

interface MainAppProps {
  user: any;
  profile: any; // Add profile prop
  onLogout: () => void;
}

interface TasteItem {
  id: string;
  comment: string;
  rating: number | null;
  createdAt: string;

  userId: string;
  userNickname: string;
  userProfileImage: string | null;

  type: 'movie' | 'book' | 'music' | 'photo' | string;
  title: string;
  image: string | null;
  author: string | null;
  releaseYear: number | null;

  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
  likesCount: number;
}

export default function MainApp({ user, profile, onLogout }: MainAppProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showAddTaste, setShowAddTaste] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<
    'all' | 'movie' | 'book' | 'music' | 'photo'
  >('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>(
    'all',
  );
  const [hideDuplicates, setHideDuplicates] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // 상세 보기할 포스트 객체
  const [selectedPost, setSelectedPost] = useState<TasteItem | null>(null);
  // 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);
  // 수정할 소감/코멘트 내용
  const [editComment, setEditComment] = useState('');
  // 수정할 별점
  const [editRating, setEditRating] = useState<number | null>(null);

  // 모달이 닫히면 수정 모드 상태를 초기화하는 Effect
  useEffect(() => {
    if (!selectedPost) {
      setIsEditing(false);
      setEditComment('');
      setEditRating(null);
    }
  }, [selectedPost]);

  // 삭제 확인 팝업 노출 여부
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // 삭제 예정인 포스트 ID
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('moimoi');
  const [posts, setPosts] = useState<Record<string, TasteItem[]>>({
    moimoi: [],
    tastopia: [],
    favfolk: [],
    zzimzzim: [],
  });
  const [page, setPage] = useState<Record<string, number>>({
    moimoi: 1,
    tastopia: 1,
    favfolk: 1,
    zzimzzim: 1,
  });
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({
    moimoi: true,
    tastopia: true,
    favfolk: true,
    zzimzzim: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadPosts = useCallback(
    async (tab: string, pageNum: number) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          tab,
          page: pageNum.toString(),
          limit: '10',
          type: filterType,
          rating: ratingFilter.toString(),
          hideDuplicates: hideDuplicates.toString(),
        });
        const response = await fetch(`/api/posts/list?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: TasteItem[] = await response.json();

        setPosts((prev) => ({
          ...prev,
          [tab]: pageNum === 1 ? data : [...(prev[tab] ?? []), ...data],
        }));
        setPage((prev) => ({ ...prev, [tab]: pageNum + 1 }));
        setHasMore((prev) => ({ ...prev, [tab]: data.length === 10 }));
      } catch (err) {
        console.error(`Error fetching posts for tab ${tab}:`, err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, filterType, ratingFilter, hideDuplicates],
  );

  useEffect(() => {
    loadPosts(activeTab, 1);
  }, [activeTab, filterType, ratingFilter, hideDuplicates]);

  const lastPostElementRef = useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore[activeTab]) {
          loadPosts(activeTab, page[activeTab] ?? 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, activeTab, page, loadPosts],
  );

  const handleProfileEdit = () => {
    router.push('/profile');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-3 h-3" />;
      case 'book':
        return <Book className="w-3 h-3" />;
      case 'music':
        return <Headphones className="w-3 h-3" />;
      case 'photo':
        return <Camera className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleAddTaste = () => {
    setShowAddTaste(false);
    loadPosts(activeTab, 1);
  };

  const updatePostState = (
    postId: string,
    updateFn: (taste: TasteItem) => TasteItem,
  ) => {
    setPosts((prevPosts) => ({
      ...prevPosts,
      [activeTab]: (prevPosts[activeTab] ?? []).map((taste) =>
        taste.id === postId ? updateFn(taste) : taste,
      ),
    }));
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) throw new Error('Failed to toggle like');

      const updateFn = (taste: TasteItem) => ({
        ...taste,
        isLiked: !taste.isLiked,
        likesCount: taste.isLiked ? taste.likesCount - 1 : taste.likesCount + 1,
      });

      updatePostState(postId, updateFn);

      setSelectedPost((prev) => {
        if (prev && prev.id === postId) {
          return updateFn(prev);
        }
        return prev;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const toggleBookmark = async (postId: string) => {
    try {
      const response = await fetch('/api/posts/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) throw new Error('Failed to toggle bookmark');

      const updateFn = (taste: TasteItem) => ({
        ...taste,
        isBookmarked: !taste.isBookmarked,
      });

      updatePostState(postId, updateFn);

      setSelectedPost((prev) => {
        if (prev && prev.id === postId) {
          return updateFn(prev);
        }
        return prev;
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "오류",
        description: "찜하기 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      if (!response.ok) throw new Error('Failed to toggle follow');

      const updateFn = (p: TasteItem) =>
        p.userId === targetUserId ? { ...p, isFollowing: !p.isFollowing } : p;

      setPosts((prevPosts) => {
        const newPosts = { ...prevPosts };
        for (const tab in newPosts) {
          newPosts[tab] = (newPosts[tab] ?? []).map(updateFn);
        }
        return newPosts;
      });

      setSelectedPost((prev) => {
        if (prev && prev.userId === targetUserId) {
          return { ...prev, isFollowing: !prev.isFollowing };
        }
        return prev;
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "오류",
        description: "팔로우 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const requestDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      const response = await fetch(`/api/posts/${postToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');

      // 성공 토스트인 경우 제목(title) 없이 내용(description)만 표시합니다.
      toast({
        description: '게시물이 삭제되었습니다.',
      });

      setPosts((prevPosts) => {
        const newPosts = { ...prevPosts };
        for (const tab in newPosts) {
          newPosts[tab] = (newPosts[tab] ?? []).filter(
            (taste) => taste.id !== postToDelete,
          );
        }
        return newPosts;
      });

      if (selectedPost && selectedPost.id === postToDelete) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: '오류',
        description: '게시물 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setPostToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const startEditing = () => {
    if (!selectedPost) return;
    setEditComment(selectedPost.comment);
    setEditRating(selectedPost.rating);
    setIsEditing(true);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;
    // 입력 검증 실패 시 title을 '실패'로 설정하여 표시합니다.
    if (!editComment.trim()) {
      toast({
        title: '실패',
        description: '소감을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    if (
      selectedPost.type !== 'photo' &&
      (editRating === null || editRating === undefined)
    ) {
      toast({
        title: '실패',
        description: '별점을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: editComment,
          rating: editRating,
        }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      toast({
        description: '게시물이 성공적으로 수정되었습니다.',
      });

      const updateFn = (taste: TasteItem) => ({
        ...taste,
        comment: editComment,
        rating: editRating,
      });

      setPosts((prevPosts) => {
        const newPosts = { ...prevPosts };
        for (const tab in newPosts) {
          newPosts[tab] = (newPosts[tab] ?? []).map((p) =>
            p.id === selectedPost.id ? updateFn(p) : p,
          );
        }
        return newPosts;
      });

      setSelectedPost((prev) => {
        if (prev && prev.id === selectedPost.id) {
          return updateFn(prev);
        }
        return prev;
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: '오류',
        description: '게시물 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 디버깅을 위해 렌더링 시 selectedPost 상태 콘솔 출력
  console.log('[MainApp] Render, selectedPost:', selectedPost);

  if (showAddTaste) {
    return (
      <AddTaste
        onAdd={handleAddTaste}
        onCancel={() => setShowAddTaste(false)}
      />
    );
  }

  const renderGridItem = (taste: TasteItem) => (
    <div
      className="border-r border-b border-black bg-white cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => {
        console.log('[MainApp] Grid item clicked, taste:', taste);
        setSelectedPost(taste);
      }}
    >
      <div className="aspect-square border-b border-black">
        <img
          src={taste.image || '/placeholder.svg'}
          alt={taste.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            {getTypeIcon(taste.type)}
            {taste.type}
          </span>
          {taste.rating !== null && taste.rating !== undefined && (
            <div className="flex items-center gap-0.5">
              {[...Array(taste.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 fill-black text-black"
                />
              ))}
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm mb-1 line-clamp-1">{taste.title}</h3>
        <p className="text-xs text-gray-500 mb-2">by {taste.userNickname}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-2 leading-5 min-h-10">
          {taste.comment}
        </p>
        <div
          className="flex items-center justify-between text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(taste.id)}
              className="flex items-center gap-1 hover:text-red-500"
            >
              <Heart
                className={`w-3 h-3 ${taste.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
              />
              {taste.likesCount}
            </button>
            <button
              onClick={() => toggleBookmark(taste.id)}
              className={`hover:text-blue-500 ${taste.isBookmarked ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <Bookmark
                className={`w-3 h-3 ${taste.isBookmarked ? 'fill-current' : ''}`}
              />
            </button>
          </div>
          {taste.userId === user.id ? (
            <button
              onClick={() => requestDeletePost(taste.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => toggleFollow(taste.userId)}
              className="text-gray-500 hover:text-black"
            >
              {taste.isFollowing ? '팔로잉' : '팔로우'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderListItem = (taste: TasteItem) => (
    <div
      className="border-b border-black bg-white p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => {
        console.log('[MainApp] List item clicked, taste:', taste);
        setSelectedPost(taste);
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 flex-shrink-0 border border-gray-200 flex items-center justify-center">
          <img
            src={taste.image || '/placeholder.svg'}
            alt={taste.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              {getTypeIcon(taste.type)}
              {taste.type}
            </span>
            {taste.rating !== null && taste.rating !== undefined && (
              <div className="flex items-center gap-0.5">
                {[...Array(taste.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 fill-black text-black"
                  />
                ))}
              </div>
            )}
          </div>
          <h3 className="font-medium text-base mb-1">{taste.title}</h3>
          <p className="text-xs text-gray-500 mb-2">by {taste.userNickname}</p>
          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
            {taste.comment}
          </p>
          <div
            className="flex items-center justify-between text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLike(taste.id)}
                className="flex items-center gap-1 hover:text-red-500"
              >
                <Heart
                  className={`w-3 h-3 ${taste.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                />
                {taste.likesCount}
              </button>
              <button
                onClick={() => toggleBookmark(taste.id)}
                className={`hover:text-blue-500 ${taste.isBookmarked ? 'text-blue-600' : 'text-gray-500'}`}
              >
                <Bookmark
                  className={`w-3 h-3 ${taste.isBookmarked ? 'fill-current' : ''}`}
                />
              </button>
            </div>
            {taste.userId === user.id ? (
              <button
                onClick={() => requestDeletePost(taste.id)}
                className="text-gray-500 hover:text-black"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => toggleFollow(taste.userId)}
                className="text-gray-500 hover:text-black"
              >
                {taste.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const HelpTooltip = () => (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">도움말</h3>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-500 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <h4 className="font-medium mb-1">📝 MoiMoi</h4>
            <p className="text-gray-600">
              내가 직접 올린 취향들을 모아볼 수 있어요
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">🌍 Tastopia</h4>
            <p className="text-gray-600">
              모든 사용자들의 다양한 취향을 탐색해보세요
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">👥 FavFolk</h4>
            <p className="text-gray-600">
              팔로우한 사람들의 취향만 골라서 볼 수 있어요
            </p>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <h4 className="font-medium mb-1">⭐ ZzimZzim</h4>
            <p className="text-gray-600">
              북마크한 취향들을 저장해두고 나중에 다시 볼 수 있어요
            </p>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <h4 className="font-medium mb-1">🔄 중복 숨기기</h4>
            <p className="text-gray-600">
              같은 제목의 영화/책/음악이 여러 개 있을 때 하나만 보여줍니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = (tabName: keyof typeof posts) => {
    const currentPosts = posts[tabName] ?? [];
    return (
      <div
        className={`${viewMode === 'grid' ? 'grid grid-cols-2' : 'flex flex-col'} border-l border-black`}
      >
        {currentPosts.map((taste, index) => {
          const component =
            viewMode === 'grid' ? renderGridItem(taste) : renderListItem(taste);
          if (currentPosts.length === index + 1) {
            return (
              <div
                ref={lastPostElementRef}
                key={taste.id}
              >
                {component}
              </div>
            );
          }
          return <div key={taste.id}>{component}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black bg-white">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'serif' }}
          >
            Taste Buds
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAddTaste(true)}
              className="bg-white hover:bg-gray-50 text-black border border-black text-sm px-3 py-1 h-auto w-auto flex items-center justify-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              취향 등록
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 border border-black cursor-pointer flex items-center justify-center">
                  {user?.image && (
                    <AvatarImage
                      src={user.image}
                      alt={profile?.nickname || user?.name || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-white text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-black rounded-none bg-white"
              >
                <DropdownMenuLabel>
                  {profile?.nickname || user?.name || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onSelect={handleProfileEdit}
                  className="cursor-pointer my-2"
                >
                  프로필 수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={onLogout}
                  className="cursor-pointer"
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-black bg-white">
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-4">
              {['all', 'movie', 'book', 'music', 'photo'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`${
                    filterType === type
                      ? 'text-black font-medium'
                      : 'text-gray-500'
                  } hover:text-black transition-colors`}
                >
                  {type === 'all'
                    ? '전체'
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setHideDuplicates(!hideDuplicates)}
                className={`text-xs px-2 py-1 border border-black ${
                  hideDuplicates ? 'bg-black text-white' : 'bg-white text-black'
                } hover:bg-gray-100 transition-colors`}
              >
                중복 숨기기
              </button>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="w-5 h-5 border border-black rounded-full bg-white hover:bg-gray-100 flex items-center justify-center"
              >
                <HelpCircle className="w-3 h-3" />
              </button>
              {showHelp && <HelpTooltip />}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">별점:</span>
            <Select
              value={ratingFilter.toString()}
              onValueChange={(value) =>
                setRatingFilter(
                  value === 'all'
                    ? 'all'
                    : (Number.parseInt(value) as 1 | 2 | 3 | 4 | 5),
                )
              }
            >
              <SelectTrigger className="w-auto h-8 border border-black rounded-none bg-white text-black">
                <SelectValue placeholder="별점" />
              </SelectTrigger>
              <SelectContent className="w-auto border border-black rounded-none bg-white text-black">
                <SelectItem
                  value="all"
                  className="[&>.absolute]:hidden px-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                >
                  전체
                </SelectItem>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem
                    key={rating}
                    value={rating.toString()}
                    className="group [&>.absolute]:hidden px-2 data-[state=checked]:bg-black data-[state=checked]:text-white"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-black text-black group-data-[state=checked]:fill-white group-data-[state=checked]:text-white"
                        />
                      ))}
                      <span>{rating}점</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">보기 방식:</span>
            <Button
              onClick={() => setViewMode('grid')}
              className={`text-xs px-2 py-1 border border-black ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              } hover:bg-gray-100 transition-colors`}
            >
              썸네일
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              className={`text-xs px-2 py-1 border border-black ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              } hover:bg-gray-100 transition-colors`}
            >
              목록
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b border-black bg-white">
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="moimoi"
              className="border-r border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              MoiMoi
            </TabsTrigger>
            <TabsTrigger
              value="tastopia"
              className="border-r border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              Tastopia
            </TabsTrigger>
            <TabsTrigger
              value="favfolk"
              className="border-r border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              FavFolk
            </TabsTrigger>
            <TabsTrigger
              value="zzimzzim"
              className="border-r border-black data-[state=active]:bg-black data-[state=active]:text-white bg-white text-gray-600 font-medium py-3 px-2 rounded-none transition-all hover:bg-gray-50 text-xs"
            >
              ZzimZzim
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="moimoi"
          className="mt-0"
        >
          {renderTabContent('moimoi')}
        </TabsContent>
        <TabsContent
          value="tastopia"
          className="mt-0"
        >
          {renderTabContent('tastopia')}
        </TabsContent>
        <TabsContent
          value="favfolk"
          className="mt-0"
        >
          {renderTabContent('favfolk')}
        </TabsContent>
        <TabsContent
          value="zzimzzim"
          className="mt-0"
        >
          {renderTabContent('zzimzzim')}
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {!isLoading &&
        !hasMore[activeTab] &&
        (posts[activeTab]?.length ?? 0) === 0 && (
          <div className="text-center p-10 text-gray-500">
            표시할 취향이 없습니다.
          </div>
        )}
      {!isLoading &&
        !hasMore[activeTab] &&
        (posts[activeTab]?.length ?? 0) > 0 && (
          <div className="text-center p-4 text-gray-500 text-sm">
            더 이상 불러올 취향이 없습니다.
          </div>
        )}
      {error && (
        <div className="text-center p-10 text-red-500">Error: {error}</div>
      )}

      {/* 상세 보기 커스텀 모달 (Radix UI Portal 충돌 우회 및 100% 렌더링 보장) */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          {/* 모달 바깥 배경 클릭 시 닫기 */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedPost(null)}
          />

          {/* 모달 콘텐츠 바디 (레트로/Brutalism 굵은 검은 테두리와 묵직한 그림자) */}
          <div className="relative w-full max-w-3xl border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black overflow-hidden flex flex-col md:flex-row max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-20 border border-black bg-white p-1.5 hover:bg-black hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 이미지 영역 */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-black min-h-[300px] md:min-h-full">
              <img
                src={selectedPost.image || '/placeholder.svg'}
                alt={selectedPost.title}
                className="w-full h-full object-cover max-h-[350px] md:max-h-full"
              />
            </div>

            {/* 정보 영역 */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
              <div className="space-y-4">
                {/* 작성자 프로필 */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      setSelectedPost(null);
                      router.push(`/user/${selectedPost.userId}`);
                    }}
                  >
                    <Avatar className="w-8 h-8 border border-black transition-transform group-hover:scale-105">
                      {selectedPost.userProfileImage ? (
                        <img
                          src={selectedPost.userProfileImage}
                          alt={selectedPost.userNickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-white text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <span className="font-bold text-sm block group-hover:underline">
                        {selectedPost.userNickname}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* 팔로우 버튼 (내가 아닌 경우만) */}
                  {selectedPost.userId !== user.id && (
                    <Button
                      onClick={() => toggleFollow(selectedPost.userId)}
                      className={`text-xs px-3 py-1 h-7 rounded-none border border-black transition-colors ${
                        selectedPost.isFollowing
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      {selectedPost.isFollowing ? '팔로잉' : '팔로우'}
                    </Button>
                  )}
                </div>

                <hr className="border-black" />

                {/* 컨텐츠 상세 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 border border-black flex items-center gap-1 font-medium bg-gray-50">
                      {getTypeIcon(selectedPost.type)}
                      {selectedPost.type === 'movie'
                        ? '영화'
                        : selectedPost.type === 'book'
                          ? '책'
                          : selectedPost.type === 'music'
                            ? '음악'
                            : '사진'}
                    </span>
                    {selectedPost.type !== 'photo' &&
                      (isEditing ? (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setEditRating(score)}
                              className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  score <= (editRating || 0)
                                    ? 'fill-black text-black'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        selectedPost.rating !== null &&
                        selectedPost.rating !== undefined && (
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (selectedPost.rating || 0)
                                    ? 'fill-black text-black'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )
                      ))}
                  </div>

                  <h2 className="text-2xl font-bold font-serif leading-tight">
                    {selectedPost.title}
                  </h2>

                  {/* 추가 정보 (작가, 가수, 감독 등) */}
                  {selectedPost.type !== 'photo' && (
                    <p className="text-sm text-gray-600">
                      {selectedPost.type === 'movie' && '감독: '}
                      {selectedPost.type === 'book' && '저자: '}
                      {selectedPost.type === 'music' && '아티스트: '}
                      <span className="font-medium">
                        {selectedPost.author || '정보 없음'}
                      </span>
                      {selectedPost.releaseYear &&
                        ` (${selectedPost.releaseYear}년)`}
                    </p>
                  )}
                </div>

                {/* 소감 / 설명 */}
                <div className="pt-2">
                  {isEditing ? (
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full border border-black p-3 rounded-none resize-none h-44 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-black leading-relaxed text-black bg-white"
                      placeholder="소감을 적어주세요."
                    />
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed max-h-[200px] overflow-y-auto whitespace-pre-wrap pr-2 border-l-2 border-black pl-3">
                      {selectedPost.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* 하단 액션 */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                {isEditing ? (
                  <div className="flex items-center justify-end w-full gap-2">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="text-xs h-9 border-black rounded-none bg-white hover:bg-gray-50 text-black px-4"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleUpdatePost}
                      className="text-xs h-9 rounded-none bg-black hover:bg-gray-800 text-white border border-black px-4"
                    >
                      저장하기
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(selectedPost.id)}
                        className="flex items-center gap-1.5 text-sm hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-transform active:scale-125 ${
                            selectedPost.isLiked
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-500'
                          }`}
                        />
                        <span className="font-medium">
                          {selectedPost.likesCount}
                        </span>
                      </button>
                      <button
                        onClick={() => toggleBookmark(selectedPost.id)}
                        className={`text-sm hover:text-blue-500 transition-colors ${
                          selectedPost.isBookmarked
                            ? 'text-blue-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <Bookmark
                          className={`w-5 h-5 transition-transform active:scale-125 ${
                            selectedPost.isBookmarked ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* 수정 / 삭제 (내가 올린 글인 경우만) */}
                    {selectedPost.userId === user.id && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={startEditing}
                          variant="outline"
                          className="text-xs h-8 border-black rounded-none bg-white hover:bg-gray-50 text-black flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          수정하기
                        </Button>
                        <Button
                          onClick={() => requestDeletePost(selectedPost.id)}
                          className="text-xs h-8 rounded-none bg-red-500 hover:bg-red-600 text-white border border-red-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          삭제하기
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 커스텀 모달 (Radix UI Portal 충돌 우회 및 100% 노출 보장) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          {/* 모달 바깥 배경 클릭 시 닫기 */}
          <div
            className="absolute inset-0 cursor-default"
            onClick={() => setShowDeleteConfirm(false)}
          />

          {/* 모달 콘텐츠 바디 (레트로/Brutalism 굵은 검은 테두리와 묵직한 그림자) */}
          <div className="relative w-full max-w-sm border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg font-serif mb-2">
              삭제하시겠습니까?
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              이 동작은 되돌릴 수 없습니다. 정말로 이 게시물을 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="border border-black rounded-none bg-white hover:bg-gray-100 text-black text-sm flex-1 py-2 h-auto"
              >
                X (취소)
              </Button>
              <Button
                onClick={confirmDeletePost}
                className="bg-red-500 hover:bg-red-600 text-white rounded-none border border-black text-sm flex-1 py-2 h-auto"
              >
                O (삭제)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
