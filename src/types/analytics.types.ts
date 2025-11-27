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

export interface ActiveResponse{
    count: number;
    timestamp: Date;
}

export interface topPages{
    pagePath: string;
    viewCount: number;
    uniqueVisitors: number;
}


export interface dashboard{
    activeVisitors: number;
    todayUniqueVisitors: number;
    todayUniqueViews: number;
    yesterdayUniqueVisitors: number;
    yesterdayUniqueViews: number;
    percentageChange: number;
    dailyStats: dailyStats[];
    topPages: topPages[];
    conversion: conversion[];
}

export interface dailyStats{
    date: Date;
    uniqueVisitors: number;
    totalPageViews: number;
    avgPagesPerVisitor: number;
}

export interface conversion{
    totalVisitors: number;
    totalContactForms: number;
    conversionRate: number;
    todayContactForms: number;
    yesterdayContactForms: number;
}