import React, { useEffect } from 'react'
import { useUiStore } from '../../stores/uiStore';

const HomePage = () => {
    const { closePanel } = useUiStore();

    useEffect(() => {
        closePanel();
    }, []);

    return null;
};

export default HomePage
