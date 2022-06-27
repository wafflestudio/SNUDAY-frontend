declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  private_channel_id: number;
}
interface Channel {
  id: number;
  name: string;
  image: string;
  description: string;
  is_private: boolean;
  is_official: boolean;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  subscribers_count: number;
  managers: string;
  managers_id: string;
}
interface Event {
  id: number;
  title: string;
  memo: string;
  channel: number;
  writer: number;
  has_time: boolean;
  start_date: string;
  due_date: string;
  start_time: string;
  due_time: string;
}
interface Notice {
  id: number;
  title: string;
  contents: string;
  channel: number;
  channel_name: string;
  writer: number;
  writer_name: string;
  created_at: string;
  updated_at: string;
}
type SearchChannelType = 'all' | 'name' | 'description';
type SearchNoticeType = 'all' | 'title' | 'contents';
