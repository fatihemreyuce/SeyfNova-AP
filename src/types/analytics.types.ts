export interface TrackRequest{
    pagePath: string;
    pageTitle: string;
    referrer: string;
}

export interface TrackResponse{
    visitorId: string;
    sessionId: string;
    tracked: boolean;
}

export interface active {
    count: number;
    timestamp: Date;
}

export interface topPages {
    pagePath: string;
    viewCount: number;
    uniqueVisitors: number;
}

export interface dailyStats{
    date: Date;
    uniqueVisitors: number;
    totalPageViews: number;
    avgPagePerVisitor: number;
}

export interface conversion{
    totalVisitors: number;
    totalContactForms: number;
    conversionRate: number;
    todayContactForms: number;
    yesterdayContactForms: number;
}

export interface dashboard{
    activeVisitors: number;
    todayUniqueVisitors: number;
    totalPageViews: number;
    todayPageViews: number;
    yesterdayUniqueVisitors: number;
    yesterdayPageViews: number;
    percentageChange: number;
    dailyStats: dailyStats[];
    topPages: topPages[];
    conversion: conversion[];
}