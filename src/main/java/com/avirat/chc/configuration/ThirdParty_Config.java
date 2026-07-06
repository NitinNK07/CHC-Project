package com.avirat.chc.configuration;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ThirdParty_Config {
    @Bean
    public ModelMapper getBeanOfMapper(){
        return new ModelMapper();
    }
}
